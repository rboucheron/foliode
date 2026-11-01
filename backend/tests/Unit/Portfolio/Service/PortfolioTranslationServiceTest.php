<?php

declare(strict_types=1);

namespace App\Tests\Unit\Portfolio\Service;

use App\Entity\Portfolio\PortfolioLanguage;
use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\PortfolioTranslation;
use App\Entity\Portfolio\Projects;
use App\Entity\Portfolio\ProjectTranslation;
use App\Portfolio\Dto\SaveTranslationsDTO;
use App\Portfolio\Dto\UpdatePortfolioLanguagesDTO;
use App\Portfolio\Service\LanguageCodeResolver;
use App\Portfolio\Service\PortfolioTranslationService;
use App\Portfolio\Service\TranslationHasher;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class PortfolioTranslationServiceTest extends TestCase
{
    private EntityManagerInterface&MockObject $entityManager;
    private ValidatorBaseService&MockObject $validator;
    private TranslationHasher $hasher;
    private PortfolioTranslationService $service;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->validator = $this->createMock(ValidatorBaseService::class);
        $this->hasher = new TranslationHasher();

        $this->service = new PortfolioTranslationService(
            $this->entityManager,
            new LanguageCodeResolver(),
            $this->hasher,
            $this->validator
        );
    }

    public function testStatusOfAnUntranslatedPortfolioUsesEmptyObjects(): void
    {
        $portfolio = $this->createPortfolio();
        $portfolio->addProject($this->createProject('project-1', 'Projet', 'Description'));

        $status = $this->service->getStatus($portfolio);

        self::assertNull($status['sourceLanguage']);
        self::assertSame([], $status['languages']);
        self::assertSame(['title' => 'Titre', 'subtitle' => 'Sous-titre', 'bio' => 'Bio'], $status['portfolio']['source']);

        $json = (string) json_encode($status);
        self::assertStringContainsString('"portfolio":{"source":{"title":"Titre","subtitle":"Sous-titre","bio":"Bio"},"translations":{}}', $json);
        self::assertStringContainsString('"projects":[{"id":"project-1","source":{"title":"Projet","description":"Description"},"translations":{}}]', $json);
    }

    public function testUpdateLanguagesCreatesSourceAndTargets(): void
    {
        $portfolio = $this->createPortfolio();
        $this->entityManager->expects($this->once())->method('flush');

        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [
            ['code' => 'en', 'label' => null],
            ['code' => null, 'label' => 'Italiano'],
            ['code' => 'x-deutsch', 'label' => 'Deutsch'],
        ]));

        $status = $this->service->getStatus($portfolio);
        self::assertSame(['code' => 'fr', 'label' => null], $status['sourceLanguage']);
        self::assertSame([
            ['code' => 'en', 'label' => null],
            ['code' => 'x-italiano', 'label' => 'Italiano'],
            ['code' => 'x-deutsch', 'label' => 'Deutsch'],
        ], $status['languages']);
    }

    public function testSourceLanguageCannotAlsoBeATarget(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->service->updateLanguages($this->createPortfolio(), $this->languagesDto(['code' => 'fr'], [['code' => 'fr']]));
    }

    public function testDuplicatedLanguagesAreRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);
        $this->expectExceptionMessage('listed twice');

        $this->service->updateLanguages($this->createPortfolio(), $this->languagesDto(['code' => 'fr'], [
            ['code' => null, 'label' => 'Italiano'],
            ['code' => null, 'label' => ' italiano '],
        ]));
    }

    public function testTooManyLanguagesAreRejected(): void
    {
        $languages = array_map(
            static fn (int $index): array => ['code' => null, 'label' => 'Langue ' . $index],
            range(1, PortfolioTranslationService::MAX_TARGET_LANGUAGES + 1)
        );

        $this->expectException(BadRequestHttpException::class);

        $this->service->updateLanguages($this->createPortfolio(), $this->languagesDto(['code' => 'fr'], $languages));
    }

    public function testInvalidLanguageCodeIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->service->updateLanguages($this->createPortfolio(), $this->languagesDto(['code' => 'fr'], [['code' => 'english']]));
    }

    public function testNonObjectLanguageIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->service->updateLanguages($this->createPortfolio(), $this->languagesDto(['code' => 'fr'], ['en']));
    }

    public function testSourceLanguageCanChangeWhileNothingIsTranslated(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'en'], [['code' => 'fr']]));

        $status = $this->service->getStatus($portfolio);
        self::assertSame(['code' => 'en', 'label' => null], $status['sourceLanguage']);
        self::assertSame([['code' => 'fr', 'label' => null]], $status['languages']);
        self::assertCount(2, $portfolio->getPortfolioLanguages());
    }

    public function testSourceLanguageChangeIsRefusedWhenTranslationsExist(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));
        $project = $this->createProject('project-1', 'Projet', 'Description');
        $portfolio->addProject($project);
        $project->addProjectTranslation((new ProjectTranslation())->setLanguage('en')->setTitle('Project')->setDescription('Description'));

        $this->expectException(BadRequestHttpException::class);
        $this->expectExceptionMessage('source language cannot be changed');

        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'en'], []));
    }

    public function testRemovingALanguageDeletesItsTranslations(): void
    {
        $portfolio = $this->createPortfolio();
        $project = $this->createProject('project-1', 'Projet', 'Description');
        $portfolio->addProject($project);
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en'], ['code' => null, 'label' => 'Italiano']]));
        $portfolio->addPortfolioTranslation((new PortfolioTranslation())->setLanguage('en')->setTitle('Title'));
        $portfolio->addPortfolioTranslation((new PortfolioTranslation())->setLanguage('x-italiano')->setTitle('Titolo'));
        $project->addProjectTranslation((new ProjectTranslation())->setLanguage('en')->setTitle('Project')->setDescription('Description'));
        $project->addProjectTranslation((new ProjectTranslation())->setLanguage('x-italiano')->setTitle('Progetto')->setDescription('Descrizione'));

        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'x-italiano', 'label' => 'Italiano']]));

        self::assertNull($portfolio->findTranslation('en'));
        self::assertNull($project->findTranslation('en'));
        self::assertNotNull($portfolio->findTranslation('x-italiano'));
        self::assertNotNull($project->findTranslation('x-italiano'));
        self::assertSame(['fr', 'x-italiano'], array_map(
            static fn (PortfolioLanguage $language): ?string => $language->getCode(),
            array_values($portfolio->getPortfolioLanguages()->toArray())
        ));
    }

    public function testSaveMainTranslationsStoresValuesAndCurrentHash(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'en' => ['title' => ' Title ', 'subtitle' => 'Subtitle', 'bio' => 'Bio en'],
        ]));

        $translation = $portfolio->findTranslation('en');
        self::assertNotNull($translation);
        self::assertSame(['title' => 'Title', 'subtitle' => 'Subtitle', 'bio' => 'Bio en'], $translation->toContent());
        self::assertSame($this->hasher->hashPortfolio($portfolio), $translation->getSourceHash());
        self::assertFalse($this->service->getStatus($portfolio)['portfolio']['translations']->en['outdated']);
    }

    public function testSavingAgainUpdatesTheExistingTranslation(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));
        $values = ['title' => 'Title', 'subtitle' => 'Subtitle', 'bio' => 'Bio'];

        $this->service->saveMainTranslations($portfolio, $this->translationsDto(['en' => $values]));
        $this->service->saveMainTranslations($portfolio, $this->translationsDto(['en' => ['title' => 'New title'] + $values]));

        self::assertCount(1, $portfolio->getPortfolioTranslations());
        self::assertSame('New title', $portfolio->findTranslation('en')?->getTitle());
    }

    public function testFieldIsRequiredWhenSourceIsFilled(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->expectException(BadRequestHttpException::class);
        $this->expectExceptionMessage('Field "bio" is required for language "en".');

        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'en' => ['title' => 'Title', 'subtitle' => 'Subtitle', 'bio' => '   '],
        ]));
    }

    public function testFieldIsIgnoredWhenSourceIsEmpty(): void
    {
        $portfolio = $this->createPortfolio()->setSubtitle(null)->setBio('');
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'en' => ['title' => 'Title', 'subtitle' => 'Ignored', 'bio' => 'Ignored'],
        ]));

        self::assertSame(['title' => 'Title', 'subtitle' => null, 'bio' => null], $portfolio->findTranslation('en')?->toContent());
    }

    public function testTitleLengthIsLimited(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->expectException(BadRequestHttpException::class);

        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'en' => ['title' => str_repeat('a', 256), 'subtitle' => 'Subtitle', 'bio' => 'Bio'],
        ]));
    }

    public function testTranslationForUnknownLanguageIsRejected(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->expectException(BadRequestHttpException::class);
        $this->expectExceptionMessage('not one of the portfolio translation languages');

        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'fr' => ['title' => 'Titre', 'subtitle' => 'Sous-titre', 'bio' => 'Bio'],
        ]));
    }

    public function testTranslationBecomesOutdatedWhenSourceChanges(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));
        $this->service->saveMainTranslations($portfolio, $this->translationsDto([
            'en' => ['title' => 'Title', 'subtitle' => 'Subtitle', 'bio' => 'Bio'],
        ]));

        $portfolio->setBio('Bio modifiée');

        self::assertTrue($this->service->getStatus($portfolio)['portfolio']['translations']->en['outdated']);
    }

    public function testSaveProjectTranslations(): void
    {
        $portfolio = $this->createPortfolio();
        $project = $this->createProject('project-1', 'Projet', 'Description');
        $portfolio->addProject($project);
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => null, 'label' => 'Italiano']]));

        $this->service->saveProjectTranslations($portfolio, 'project-1', $this->translationsDto([
            'x-italiano' => ['title' => 'Progetto', 'description' => 'Descrizione'],
        ]));

        $status = $this->service->getStatus($portfolio);
        self::assertSame(
            ['title' => 'Progetto', 'description' => 'Descrizione', 'outdated' => false],
            $status['projects'][0]['translations']->{'x-italiano'}
        );

        $project->setDescription('Nouvelle description');
        self::assertTrue($this->service->getStatus($portfolio)['projects'][0]['translations']->{'x-italiano'}['outdated']);
    }

    public function testProjectDescriptionIsRequired(): void
    {
        $portfolio = $this->createPortfolio();
        $portfolio->addProject($this->createProject('project-1', 'Projet', 'Description'));
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->expectException(BadRequestHttpException::class);
        $this->expectExceptionMessage('Field "description" is required for language "en".');

        $this->service->saveProjectTranslations($portfolio, 'project-1', $this->translationsDto([
            'en' => ['title' => 'Project'],
        ]));
    }

    public function testProjectOfAnotherPortfolioIsNotFound(): void
    {
        $portfolio = $this->createPortfolio();
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));

        $this->expectException(NotFoundHttpException::class);

        $this->service->saveProjectTranslations($portfolio, 'unknown', $this->translationsDto([
            'en' => ['title' => 'Project', 'description' => 'Description'],
        ]));
    }

    public function testPublicSerializationOnlyExposesCurrentTargetLanguages(): void
    {
        $portfolio = $this->createPortfolio();
        $project = $this->createProject('project-1', 'Projet', 'Description');
        $portfolio->addProject($project);
        $this->service->updateLanguages($portfolio, $this->languagesDto(['code' => 'fr'], [['code' => 'en']]));
        $portfolio->addPortfolioTranslation((new PortfolioTranslation())->setLanguage('en')->setTitle('Title'));
        $portfolio->addPortfolioTranslation((new PortfolioTranslation())->setLanguage('de')->setTitle('Titel'));
        $project->addProjectTranslation((new ProjectTranslation())->setLanguage('en')->setTitle('Project')->setDescription('Desc'));

        self::assertSame(['code' => 'fr', 'label' => null], $portfolio->getSourceLanguage());
        self::assertSame([['code' => 'en', 'label' => null]], $portfolio->getLanguages());
        self::assertSame(['en'], array_keys($portfolio->getTranslations()));
        self::assertSame(['en' => ['title' => 'Project', 'description' => 'Desc']], $project->getTranslations());
    }

    private function createPortfolio(): Portfolios
    {
        return (new Portfolios())->setTitle('Titre')->setSubtitle('Sous-titre')->setBio('Bio');
    }

    private function createProject(string $id, string $title, string $description): Projects
    {
        $project = (new Projects())->setTitle($title)->setDescription($description);
        (new \ReflectionProperty(Projects::class, 'id'))->setValue($project, $id);

        return $project;
    }

    private function languagesDto(array $source, array $languages): UpdatePortfolioLanguagesDTO
    {
        $dto = new UpdatePortfolioLanguagesDTO();
        $dto->sourceLanguage = $source;
        $dto->languages = $languages;

        return $dto;
    }

    private function translationsDto(array $translations): SaveTranslationsDTO
    {
        $dto = new SaveTranslationsDTO();
        $dto->translations = $translations;

        return $dto;
    }
}
