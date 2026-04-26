<?php

namespace App\Portfolio\ApiPlatform\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Users;
use App\Portfolio\ApiPlatform\PortfolioConfigResource;
use App\Portfolio\Service\PortfolioService;
use Symfony\Bundle\SecurityBundle\Security;

class PortfolioConfigProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private PortfolioService $portfolioService
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?PortfolioConfigResource
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            return null;
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);

        $resource = new PortfolioConfigResource();
        $resource->config = $portfolio->getConfig();

        return $resource;
    }
}
