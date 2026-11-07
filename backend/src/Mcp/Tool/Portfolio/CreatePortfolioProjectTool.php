<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Users;
use App\Portfolio\Dto\ProjectDTO;
use App\Portfolio\Service\PortfolioService;
use App\Portfolio\Service\ProjectService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class CreatePortfolioProjectTool
{
    public function __construct(
        private readonly Security $security,
        private readonly PortfolioService $portfolioService,
        private readonly ProjectService $projectService,
    ) {
    }

    /**
     * @param array<array{name: string, url: string}> $links
     * @param array<array{file: string, imageAlt: string}> $images Base64 data URI images (PNG, JPEG or WebP).
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'create_portfolio_project',
        description: 'Create a project in the authenticated user portfolio. Supports title, description, links and optional base64 data URI images (PNG, JPEG or WebP). No portfolio or user identifier is accepted.'
    )]
    public function __invoke(string $title, string $description, array $links = [], array $images = []): array
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $dto = new ProjectDTO();
        $dto->title = $title;
        $dto->description = $description;
        $dto->links = $links;
        $dto->images = $images;

        $project = $this->projectService->createANewProject($this->portfolioService->getPortfolioByUser($user), $dto);
        return json_decode($this->projectService->serializeProject($project), true) ?? [];
    }
}
