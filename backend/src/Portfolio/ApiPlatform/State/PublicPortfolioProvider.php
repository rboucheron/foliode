<?php

namespace App\Portfolio\ApiPlatform\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Portfolio\PortfolioStatus;
use App\Portfolio\ApiPlatform\PortfolioResource;
use App\Portfolio\Service\PortfolioService;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/** @implements ProviderInterface<PortfolioResource> */
class PublicPortfolioProvider implements ProviderInterface
{
    public function __construct(
       private PortfolioService $portfolioService,
        private SerializerInterface $serializer
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): PortfolioResource
    {
        $url = $uriVariables['url'] ?? null;
        if (!is_string($url) || '' === trim($url)) {
            throw new NotFoundHttpException('Portfolio not found.');
        }

        $portfolio = $this->portfolioService->getPortfolioByUniqueUrl($url);

        if($portfolio->getStatus() !== PortfolioStatus::PUBLISHED) {
            throw new NotFoundHttpException('Portfolio is not published.');
        }

        $payload = json_decode(
            $this->serializer->serialize($portfolio, 'json', ['groups' => 'getPortfolio']),
            true
        );

        if (!is_array($payload)) {
            throw new NotFoundHttpException('Portfolio resource could not be serialized.');
        }

        $resource = new PortfolioResource();
        $resource->status = $payload['status'] ?? null;
        $resource->title = $payload['title'] ?? null;
        $resource->url = $payload['url'] ?? null;
        $resource->subtitle = $payload['subtitle'] ?? null;
        $resource->bio = $payload['bio'] ?? null;
        $resource->config = $payload['config'] ?? null;
        $resource->template = $payload['template'] ?? null;
        $resource->author = $payload['author'] ?? null;
        $resource->users = $payload['users'] ?? null;
        $resource->projects = $payload['projects'] ?? [];
        $resource->tools = $payload['tools'] ?? [];
        $resource->sourceLanguage = $payload['sourceLanguage'] ?? null;
        $resource->languages = $payload['languages'] ?? [];
        $resource->translations = $payload['translations'] ?? [];

        return $resource;
    }
}
