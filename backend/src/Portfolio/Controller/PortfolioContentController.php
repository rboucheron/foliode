<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\CreatNewPortfolioDTO;
use App\Portfolio\Dto\UpdatePortfolioDTO;
use App\Portfolio\Service\PortfolioService;
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
        private SerializerInterface $serializer
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/create', methods: ['POST'])]
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
    #[Route('/v1/api/portfolio/update', methods: ['PUT'])]
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
            Response::HTTP_CREATED,
            [],
            true
        );
    }
}