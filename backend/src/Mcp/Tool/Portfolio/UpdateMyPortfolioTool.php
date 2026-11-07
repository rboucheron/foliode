<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Portfolio\Template;
use App\Entity\Users;
use App\Portfolio\Dto\UpdatePortfolioDTO;
use App\Portfolio\Service\PortfolioService;
use Mcp\Capability\Attribute\McpTool;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class UpdateMyPortfolioTool
{
    /**
     * Update editable fields of the authenticated user's portfolio.
     */
    public function __construct(
        private readonly Security $security,
        private readonly PortfolioService $portfolioService,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    #[McpTool(
        name: 'update_my_portfolio',
        description: 'Update the authenticated user portfolio content and appearance settings. Supports title, subtitle, bio, comment message, public URL, template identifier and the complete template config object. Omit fields to keep current values; use an empty string to clear text fields. The template must be one returned by list_portfolio_templates.'
    )]
    public function __invoke(
        ?string $title = null,
        ?string $subtitle = null,
        ?string $bio = null,
        ?string $commentMessage = null,
        ?string $url = null,
        ?string $template = null,
        ?array $config = null,
    ): array {
        $user = $this->security->getUser();
        if (!$user instanceof Users) {
            throw new AccessDeniedHttpException('An authenticated Foliode account is required.');
        }

        if ($template !== null && !in_array($template, Template::getAvailableTemplates(), true)) {
            throw new BadRequestHttpException('Unknown template. Call list_portfolio_templates to get available identifiers.');
        }

        $dto = new UpdatePortfolioDTO();
        $dto->title = $title;
        $dto->subtitle = $subtitle;
        $dto->bio = $bio;
        $dto->commentMessage = $commentMessage;
        $dto->url = $url;
        $dto->template = $template;
        $dto->config = $config;

        $portfolio = $this->portfolioService->updatePortfolio($this->portfolioService->getPortfolioByUser($user), $dto);
        $data = json_decode($this->portfolioService->serializePortfolio($portfolio), true);
        if (!is_array($data)) {
            throw new \RuntimeException('Unable to serialize the updated portfolio.');
        }

        unset($data['users']);
        return $data;
    }
}
