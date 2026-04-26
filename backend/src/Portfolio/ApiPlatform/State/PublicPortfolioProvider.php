<?php

namespace App\Portfolio\ApiPlatform\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Portfolio\PortfolioStatus;
use App\Portfolio\ApiPlatform\PortfolioResource;
use App\Portfolio\Service\PortfolioService;
use Symfony\Component\Serializer\SerializerInterface;

class PublicPortfolioProvider implements ProviderInterface
{
    public function __construct(
       private PortfolioService $portfolioService,
        private SerializerInterface $serializer
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?PortfolioResource
    {
        $url = $uriVariables['url'] ?? null;
        if (!is_string($url) || '' === trim($url)) {
            return null;
        }

        $portfolio = $this->portfolioService->getPortfolioByUniqueUrl($url);

        if($portfolio->getStatus() !== PortfolioStatus::PUBLISHED) {
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
