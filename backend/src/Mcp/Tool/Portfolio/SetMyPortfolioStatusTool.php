<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Portfolio\PortfolioStatus;
use App\Entity\Users;
use App\Portfolio\Service\PortfolioService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class SetMyPortfolioStatusTool
{
    public function __construct(
        private readonly Security $security,
        private readonly PortfolioService $portfolioService,
    ) {
    }

    /** @return array{status: int, label: string} */
    #[McpTool(
        name: 'set_my_portfolio_status',
        description: 'Publish the authenticated user portfolio or return it to draft. Accepts only "published" or "draft". Publishing makes the public portfolio accessible.'
    )]
    public function __invoke(string $status): array
    {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $value = match ($status) {
            'published' => PortfolioStatus::PUBLISHED,
            'draft' => PortfolioStatus::DRAFT,
            default => throw new BadRequestHttpException('Status must be either "published" or "draft".'),
        };

        $this->portfolioService->updateStatus($this->portfolioService->getPortfolioByUser($user), $value);
        return ['status' => $value, 'label' => PortfolioStatus::getStatusLabel($value)];
    }
}
