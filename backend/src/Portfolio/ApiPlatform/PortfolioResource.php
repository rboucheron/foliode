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
        uriTemplate: '/public/abc/de/v9/portfolio/{url}',
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
    /** @var array<string, mixed>|null */
    public ?array $config = null;
    public ?string $template = null;
    public ?string $author = null;
    /** @var array<string, mixed>|null */
    public ?array $users = null;
    /** @var list<array<string, mixed>> */
    public array $projects = [];
    /** @var list<array<string, mixed>> */
    public array $tools = [];
    /** @var array{code: string|null, label: string|null}|null */
    public ?array $sourceLanguage = null;
    /** @var list<array{code: string|null, label: string|null}> */
    public array $languages = [];
    /** @var array<string, array<string, mixed>> */
    public array $translations = [];

}