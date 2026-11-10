<?php

namespace App\Portfolio\ApiPlatform;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Portfolio\ApiPlatform\State\PortfolioConfigProvider;

#[ApiResource(operations: [
    new Get(
        uriTemplate: '/portfolio/config',
        provider: PortfolioConfigProvider::class,
        security: "is_granted('ROLE_USER')"
    )
])]
class PortfolioConfigResource
{
    /** @var array<string, mixed>|null */
    /** @var array<int, array<string, mixed>>|null */
    public ?array $config = null;
}
