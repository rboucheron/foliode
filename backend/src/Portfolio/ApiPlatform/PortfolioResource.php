<?php

namespace App\Portfolio\ApiPlatform;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Portfolio\ApiPlatform\State\PublicPortfolioProvider;
use App\Portfolio\ApiPlatform\State\PortfolioProvider;

#[ApiResource(operations: [
    new Get(
        uriTemplate: '/portfolio',
        provider: PortfolioProvider::class,
        security: "is_granted('ROLE_USER')"
    ),
    new Get(
        uriTemplate: '/public/portfolio/{url}',
        provider: PublicPortfolioProvider::class
    )
])]
class PortfolioResource
{
    public ?int $status = null;
    public ?string $title = null;
    public ?string $url = null;
    public ?string $subtitle = null;
    public ?string $bio = null;
    public ?array $config = null;
    public ?string $template = null;
    public ?string $author = null;
    public array $projects = [];
    public array $tools = [];

}