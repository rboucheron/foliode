<?php

namespace App\Portfolio\ApiPlatform\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Users;
use App\Portfolio\ApiPlatform\PortfolioResource;
use App\Portfolio\Service\PortfolioService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\SerializerInterface;

class PortfolioProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private PortfolioService $portfolioService,
        private SerializerInterface $serializer
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?PortfolioResource
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            return null;
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);
        if (null === $portfolio) {
            return null;
        }

        $payload = json_decode(
            $this->serializer->serialize($portfolio, 'json', ['groups' => 'getPortfolio']),
            true
        );

        if (!is_array($payload)) {
            return null;
        }

        unset($payload['users']);

        $resource = new PortfolioResource();
        $resource->status = $payload['status'] ?? null;
        $resource->title = $payload['title'] ?? null;
        $resource->url = $payload['url'] ?? null;
        $resource->subtitle = $payload['subtitle'] ?? null;
        $resource->bio = $payload['bio'] ?? null;
        $resource->config = $payload['config'] ?? null;
        $resource->template = $payload['template'] ?? null;
        $resource->author = $payload['author'] ?? null;
        $resource->projects = $payload['projects'] ?? [];
        $resource->tools = $payload['tools'] ?? [];

        return $resource;
    }
}
