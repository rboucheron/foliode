<?php

namespace App\Portfolio\Controller;

use App\Entity\Portfolio\PortfolioStatus;
use App\Portfolio\Service\PortfolioService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Routing\Annotation\Route;

class PortfolioStatusController extends AbstractController
{
     public function __construct(
        private PortfolioService $portfolioService,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/status/publish', name: 'app_portfolio_status_publish', methods: ['PATCH'])]
    public function setStatusToPublished() : JsonResponse
    {
        $this->portfolioService->updateStatus(
            $this->portfolioService->getPortfolioByUser(
                $this->getUser()
            ), 
            PortfolioStatus::PUBLISHED
        );
       
        return $this->json([
            'message' => 'Portfolio status updated successfully.',
        ]);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/status/draft', name: 'app_portfolio_status_draft', methods: ['PATCH'])]
    public function setStatusToDraft() : JsonResponse
    {
        $this->portfolioService->updateStatus(
            $this->portfolioService->getPortfolioByUser(
                $this->getUser()
            ), 
            PortfolioStatus::DRAFT
        );
       
        return $this->json([
            'message' => 'Portfolio status updated successfully.',
        ]);
    }

}