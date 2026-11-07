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
     * Retrieve the authenticated user's complete portfolio.
     *
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'get_my_portfolio',
        description: 'Retrieve the complete portfolio belonging to the authenticated Foliode user. Includes editable content, selected template, appearance configuration, projects, tools and translations. Does not expose account credentials or accept another user identifier.'
    )]
    public function __invoke(): array
    {
        $user = $this->security->getUser();

        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);
        $data = json_decode($this->portfolioService->serializePortfolio($portfolio), true);

        if (!is_array($data)) {
            throw new \RuntimeException('Unable to serialize the authenticated portfolio.');
        }

        unset($data['users']);

        return $data;
    }
}
