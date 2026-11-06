<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Users;
use App\Portfolio\Service\PortfolioService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class GetMyPortfolioTool
{
    public function __construct(
        private readonly Security $security,
        private readonly PortfolioService $portfolioService,
    ) {
    }

    /**
     * Retrieve the authenticated user's portfolio.
     *
     * @return array{title: ?string, subtitle: ?string, bio: ?string, url: ?string, status: ?int}
     */
    #[McpTool(
        name: 'get_my_portfolio',
        description: 'Retrieve the portfolio belonging to the currently authenticated Foliode user. No user identifier is accepted; access is scoped to the authenticated account.'
    )]
    public function __invoke(): array
    {
        $user = $this->security->getUser();

        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);

        return [
            'title' => $portfolio->getTitle(),
            'subtitle' => $portfolio->getSubtitle(),
            'bio' => $portfolio->getBio(),
            'url' => $portfolio->getUrl(),
            'status' => $portfolio->getStatus(),
        ];
    }
}
