<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\SaveTranslationsDTO;
use App\Portfolio\Dto\UpdatePortfolioLanguagesDTO;
use App\Portfolio\Service\PortfolioService;
use App\Portfolio\Service\PortfolioTranslationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

class PortfolioTranslationController extends AbstractController
{
    public function __construct(
        private PortfolioService $portfolioService,
        private PortfolioTranslationService $portfolioTranslationService,
        private SerializerInterface $serializer,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/translations', methods: ['GET'])]
    public function getTranslations(): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());

        return new JsonResponse($this->portfolioTranslationService->getStatus($portfolio), Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/languages', methods: ['PUT'])]
    public function updateLanguages(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());

        $this->portfolioTranslationService->updateLanguages(
            $portfolio,
            $this->serializer->deserialize($request->getContent(), UpdatePortfolioLanguagesDTO::class, 'json')
        );

        return new JsonResponse($this->portfolioTranslationService->getStatus($portfolio), Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/translations/main', methods: ['PUT'])]
    public function saveMainTranslations(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());

        $this->portfolioTranslationService->saveMainTranslations(
            $portfolio,
            $this->serializer->deserialize($request->getContent(), SaveTranslationsDTO::class, 'json')
        );

        return new JsonResponse($this->portfolioTranslationService->getStatus($portfolio), Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/projects/{id}/translations', methods: ['PUT'])]
    public function saveProjectTranslations(string $id, Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());

        $this->portfolioTranslationService->saveProjectTranslations(
            $portfolio,
            $id,
            $this->serializer->deserialize($request->getContent(), SaveTranslationsDTO::class, 'json')
        );

        return new JsonResponse($this->portfolioTranslationService->getStatus($portfolio), Response::HTTP_OK);
    }
}
