<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\CreatNewPortfolioDTO;
use App\Portfolio\Dto\UpdatePortfolioDTO;
use App\Entity\Portfolio\PortfolioStatus;
use App\Portfolio\Service\PortfolioService;
use App\Service\PortfolioViewService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PortfolioContentController extends AbstractController
{
    public function __construct(
        private PortfolioService $portfolioService,
        private SerializerInterface $serializer,
        private PortfolioViewService $portfolioViewService,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio', methods: ['GET'])]
    public function getPortfolio(): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());

        return new JsonResponse(
            $this->portfolioService->serializePortfolio($portfolio),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/v1/api/public/portfolio/{url}', methods: ['GET'])]
    public function getPublicPortfolio(string $url): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUniqueUrl($url);

        if ($portfolio->getStatus() !== PortfolioStatus::PUBLISHED) {
            return new JsonResponse(['error' => 'Portfolio not found'], Response::HTTP_NOT_FOUND);
        }

        $payload = json_decode($this->portfolioService->serializePortfolio($portfolio), true);
        if (!is_array($payload)) {
            return new JsonResponse(['error' => 'Portfolio not found'], Response::HTTP_NOT_FOUND);
        }

        unset($payload['users']);

        return new JsonResponse($payload, Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/stat', methods: ['GET'])]
    public function getPortfolioStats(): JsonResponse
    {
        return new JsonResponse(
            $this->portfolioViewService->getViewsLast7Days(
                $this->portfolioService->getPortfolioByUser($this->getUser())
            ),
            Response::HTTP_OK
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio', methods: ['POST'])]
    public function creatNewPortfolio(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->createNewPortfolio(
            $this->getUser(),
            $this->serializer->deserialize(
                $request->getContent(),
                CreatNewPortfolioDTO::class,
                'json'
            )
        );

        return new JsonResponse(
            $this->portfolioService->serializePortfolio($portfolio),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio', methods: ['PUT'])]
    public function updatePortfolio(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->updatePortfolio(
            $this->portfolioService->getPortfolioByUser(
                $this->getUser()
            ),
            $this->serializer->deserialize(
                $request->getContent(),
                UpdatePortfolioDTO::class,
                'json'
            )
        );

        return new JsonResponse(
            $this->portfolioService->serializePortfolio($portfolio),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio', methods: ['DELETE'])]
    public function deletePortfolio(): JsonResponse
    {
        $this->portfolioService->deletePortfolio($this->getUser());

        return new JsonResponse(['message' => 'Portfolio deleted successfully'], Response::HTTP_OK);
    }
}