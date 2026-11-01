<?php

namespace App\Portfolio\Service;

use App\Entity\Portfolio\PortfolioLanguage;
use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\PortfolioTranslation;
use App\Entity\Portfolio\Projects;
use App\Entity\Portfolio\ProjectTranslation;
use App\Portfolio\Dto\SaveTranslationsDTO;
use App\Portfolio\Dto\UpdatePortfolioLanguagesDTO;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PortfolioTranslationService
{
    public const MAX_TARGET_LANGUAGES = 10;
    public const MAX_TITLE_LENGTH = 255;
    public const MAX_SUBTITLE_LENGTH = 255;

    public function __construct(
        private EntityManagerInterface $em,
        private LanguageCodeResolver $languageCodeResolver,
        private TranslationHasher $hasher,
        private ValidatorBaseService $validatorBaseService
    ) {
    }

    public function getStatus(Portfolios $portfolio): array
    {
        $targets = $this->targetCodes($portfolio);
        $portfolioHash = $this->hasher->hashPortfolio($portfolio);

        $portfolioTranslations = [];
        foreach ($targets as $code) {
            $translation = $portfolio->findTranslation($code);
            if ($translation !== null) {
                $portfolioTranslations[$code] = $translation->toContent() + [
                    'outdated' => $translation->getSourceHash() !== $portfolioHash,
                ];
            }
        }

        return [
            'sourceLanguage' => $portfolio->findSourceLanguage()?->toArray(),
            'languages' => array_map(
                static fn (PortfolioLanguage $language): array => $language->toArray(),
                $portfolio->findTargetLanguages()
            ),
            'portfolio' => [
                'source' => [
                    'title' => $portfolio->getTitle(),
                    'subtitle' => $portfolio->getSubtitle(),
                    'bio' => $portfolio->getBio(),
                ],
                'translations' => (object) $portfolioTranslations,
            ],
            'projects' => array_map(
                fn (Projects $project): array => $this->projectStatus($project, $targets),
                array_values($portfolio->getProjects()->toArray())
            ),
        ];
    }

    public function updateLanguages(Portfolios $portfolio, UpdatePortfolioLanguagesDTO $dto): void
    {
        $this->validatorBaseService->CatchInvalidData($dto);

        $source = $this->languageCodeResolver->resolve(
            $dto->sourceLanguage['code'] ?? null,
            $dto->sourceLanguage['label'] ?? null
        );

        $targets = [];
        foreach ($dto->languages ?? [] as $language) {
            if (!is_array($language)) {
                throw new BadRequestHttpException('Each language must be an object with a code or a label.');
            }
            $resolved = $this->languageCodeResolver->resolve($language['code'] ?? null, $language['label'] ?? null);
            if ($resolved['code'] === $source['code']) {
                throw new BadRequestHttpException('The source language cannot also be a translation language.');
            }
            if (isset($targets[$resolved['code']])) {
                throw new BadRequestHttpException(sprintf('Language "%s" is listed twice.', $resolved['code']));
            }
            $targets[$resolved['code']] = $resolved;
        }

        if (count($targets) > self::MAX_TARGET_LANGUAGES) {
            throw new BadRequestHttpException(sprintf('A portfolio cannot have more than %d translation languages.', self::MAX_TARGET_LANGUAGES));
        }

        $currentSource = $portfolio->findSourceLanguage();
        if ($currentSource !== null && $currentSource->getCode() !== $source['code'] && $this->hasAnyTranslation($portfolio)) {
            throw new BadRequestHttpException('The source language cannot be changed while translations exist. Remove the translation languages first.');
        }

        $existingCodes = [];
        foreach ($portfolio->getPortfolioLanguages()->toArray() as $language) {
            $code = (string) $language->getCode();
            if ($code === $source['code']) {
                $language->setIsSource(true)->setLabel($source['label']);
                $existingCodes[$code] = true;
                continue;
            }
            if (isset($targets[$code])) {
                $language->setIsSource(false)->setLabel($targets[$code]['label']);
                $existingCodes[$code] = true;
                continue;
            }
            $this->removeLanguage($portfolio, $language);
        }

        if (!isset($existingCodes[$source['code']])) {
            $portfolio->addPortfolioLanguage($this->createLanguage($source, true));
        }
        foreach ($targets as $code => $target) {
            if (!isset($existingCodes[$code])) {
                $portfolio->addPortfolioLanguage($this->createLanguage($target, false));
            }
        }

        $this->em->flush();
    }

    public function saveMainTranslations(Portfolios $portfolio, SaveTranslationsDTO $dto): void
    {
        $this->validatorBaseService->CatchInvalidData($dto);
        $hash = $this->hasher->hashPortfolio($portfolio);

        foreach ($dto->translations ?? [] as $language => $values) {
            $language = (string) $language;
            $this->assertTargetLanguage($portfolio, $language);
            $values = $this->assertValues($values, $language);

            $title = $this->translatedText($portfolio->getTitle(), $values['title'] ?? null, 'title', $language, self::MAX_TITLE_LENGTH);
            $subtitle = $this->translatedText($portfolio->getSubtitle(), $values['subtitle'] ?? null, 'subtitle', $language, self::MAX_SUBTITLE_LENGTH);
            $bio = $this->translatedText($portfolio->getBio(), $values['bio'] ?? null, 'bio', $language, null);

            $translation = $portfolio->findTranslation($language);
            if ($translation === null) {
                $translation = (new PortfolioTranslation())->setLanguage($language);
                $portfolio->addPortfolioTranslation($translation);
            }

            $translation
                ->setTitle($title ?? '')
                ->setSubtitle($subtitle)
                ->setBio($bio)
                ->setSourceHash($hash)
                ->setUpdatedAt(new \DateTimeImmutable());
        }

        $this->em->flush();
    }

    public function saveProjectTranslations(Portfolios $portfolio, string $projectId, SaveTranslationsDTO $dto): void
    {
        $this->validatorBaseService->CatchInvalidData($dto);
        $project = $this->findProject($portfolio, $projectId);
        $hash = $this->hasher->hashProject($project);

        foreach ($dto->translations ?? [] as $language => $values) {
            $language = (string) $language;
            $this->assertTargetLanguage($portfolio, $language);
            $values = $this->assertValues($values, $language);

            $title = $this->translatedText($project->getTitle(), $values['title'] ?? null, 'title', $language, self::MAX_TITLE_LENGTH);
            $description = $this->translatedText($project->getDescription(), $values['description'] ?? null, 'description', $language, null);

            $translation = $project->findTranslation($language);
            if ($translation === null) {
                $translation = (new ProjectTranslation())->setLanguage($language);
                $project->addProjectTranslation($translation);
            }

            $translation
                ->setTitle($title ?? '')
                ->setDescription($description ?? '')
                ->setSourceHash($hash)
                ->setUpdatedAt(new \DateTimeImmutable());
        }

        $this->em->flush();
    }

    private function projectStatus(Projects $project, array $targets): array
    {
        $hash = $this->hasher->hashProject($project);
        $translations = [];
        foreach ($targets as $code) {
            $translation = $project->findTranslation($code);
            if ($translation !== null) {
                $translations[$code] = $translation->toContent() + [
                    'outdated' => $translation->getSourceHash() !== $hash,
                ];
            }
        }

        return [
            'id' => $project->getId(),
            'source' => [
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
            ],
            'translations' => (object) $translations,
        ];
    }

    private function targetCodes(Portfolios $portfolio): array
    {
        return array_map(
            static fn (PortfolioLanguage $language): string => (string) $language->getCode(),
            $portfolio->findTargetLanguages()
        );
    }

    private function createLanguage(array $resolved, bool $isSource): PortfolioLanguage
    {
        return (new PortfolioLanguage())
            ->setCode($resolved['code'])
            ->setLabel($resolved['label'])
            ->setIsSource($isSource);
    }

    private function removeLanguage(Portfolios $portfolio, PortfolioLanguage $language): void
    {
        $code = $language->getCode();
        $portfolio->removePortfolioLanguage($language);

        foreach ($portfolio->getPortfolioTranslations()->toArray() as $translation) {
            if ($translation->getLanguage() === $code) {
                $portfolio->removePortfolioTranslation($translation);
            }
        }

        foreach ($portfolio->getProjects() as $project) {
            foreach ($project->getProjectTranslations()->toArray() as $translation) {
                if ($translation->getLanguage() === $code) {
                    $project->removeProjectTranslation($translation);
                }
            }
        }
    }

    private function hasAnyTranslation(Portfolios $portfolio): bool
    {
        if (!$portfolio->getPortfolioTranslations()->isEmpty()) {
            return true;
        }

        foreach ($portfolio->getProjects() as $project) {
            if (!$project->getProjectTranslations()->isEmpty()) {
                return true;
            }
        }

        return false;
    }

    private function assertTargetLanguage(Portfolios $portfolio, string $language): void
    {
        if (!in_array($language, $this->targetCodes($portfolio), true)) {
            throw new BadRequestHttpException(sprintf('Language "%s" is not one of the portfolio translation languages.', $language));
        }
    }

    private function assertValues(mixed $values, string $language): array
    {
        if (!is_array($values)) {
            throw new BadRequestHttpException(sprintf('Translations for language "%s" must be an object.', $language));
        }

        return $values;
    }

    private function translatedText(?string $source, mixed $value, string $field, string $language, ?int $maxLength): ?string
    {
        if ($source === null || trim($source) === '') {
            return null;
        }

        if (!is_string($value) || trim($value) === '') {
            throw new BadRequestHttpException(sprintf('Field "%s" is required for language "%s".', $field, $language));
        }

        $value = trim($value);
        if ($maxLength !== null && mb_strlen($value) > $maxLength) {
            throw new BadRequestHttpException(sprintf('Field "%s" cannot exceed %d characters for language "%s".', $field, $maxLength, $language));
        }

        return $value;
    }

    private function findProject(Portfolios $portfolio, string $projectId): Projects
    {
        foreach ($portfolio->getProjects() as $project) {
            if ((string) $project->getId() === $projectId) {
                return $project;
            }
        }

        throw new NotFoundHttpException('Project not found.');
    }
}
