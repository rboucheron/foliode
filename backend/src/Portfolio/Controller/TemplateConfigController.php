<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\TemplateColorConfigDTO;
use App\Portfolio\Dto\TemplateFontConfigDTO;
use App\Portfolio\Service\TemplateConfigService;
use App\Portfolio\Service\PortfolioService;
use App\Repository\PortfoliosRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;


class TemplateConfigController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private PortfoliosRepository $portfoliosRepository,
        private PortfolioService $portfolioService,
        private TemplateConfigService $templateConfigService
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('v1/api/portfolio/template/config/color', methods: ['POST'])]
    public function definedTemplateColor(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());
        $portfolio->setConfig(
            $this->templateConfigService->updateTemplateColor(
                $this->serializer->deserialize(
                    $request->getContent(),
                    TemplateColorConfigDTO::class,
                    'json'
                ),
                $portfolio
            )
        );
        $this->portfolioService->emPersist($portfolio);

        return new JsonResponse(
            $this->portfolioService->serializePortfolio($portfolio),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('v1/api/portfolio/template/config/font', methods: ['POST'])]
    public function definedTemplateFont(Request $request): JsonResponse
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($this->getUser());
        $portfolio->setConfig(
            $this->templateConfigService->updateTemplateFont(
                $this->serializer->deserialize(
                    $request->getContent(),
                    TemplateFontConfigDTO::class,
                    'json'
                ),
                $portfolio
            )
        );
        $this->portfolioService->emPersist($portfolio);

        return new JsonResponse(
            $this->portfolioService->serializePortfolio($portfolio),
            Response::HTTP_CREATED,
            [],
            true
        );
    }


}