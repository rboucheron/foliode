<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Users;
use App\Portfolio\Service\ProjectService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class DeletePortfolioProjectTool
{
    public function __construct(
        private readonly Security $security,
        private readonly ProjectService $projectService,
    ) {
    }

    /** @return array{success: bool, project_id: string} */
    #[McpTool(
        name: 'delete_portfolio_project',
        description: 'Permanently delete one project from the authenticated user portfolio. The project ID must come from get_my_portfolio. Projects belonging to other users cannot be deleted.'
    )]
    public function __invoke(string $projectId): array
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $this->projectService->deleteProject($user, $projectId);
        return ['success' => true, 'project_id' => $projectId];
    }
}
