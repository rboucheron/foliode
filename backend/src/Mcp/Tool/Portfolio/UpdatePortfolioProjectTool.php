<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Users;
use App\Portfolio\Dto\ProjectDTO;
use App\Portfolio\Service\ProjectService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class UpdatePortfolioProjectTool
{
    public function __construct(
        private readonly Security $security,
        private readonly ProjectService $projectService,
    ) {
    }

    /**
     * @param array<array{name: string, url: string}> $links Replaces all links; an empty array removes all links.
     * @param array<array{file: string, imageAlt: string}> $images Optional base64 data URI images to append.
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'update_portfolio_project',
        description: 'Update a project owned by the authenticated user: title, description, links and optional images. The project ID must come from get_my_portfolio. Links are replaced (an empty array clears them); existing images are retained and new images are appended.'
    )]
    public function __invoke(string $projectId, string $title, string $description, array $links = [], array $images = []): array
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $project = $this->projectService->getProjectsByUsersAndID($user, $projectId);
        $dto = new ProjectDTO();
        $dto->title = $title;
        $dto->description = $description;
        $dto->images = $images;

        $project = $this->projectService->updateProject($project, $dto);
        $this->projectService->replaceProjectLinks($project, $links);
        return json_decode($this->projectService->serializeProject($project), true) ?? [];
    }
}
