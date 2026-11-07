<?php

declare(strict_types=1);

namespace App\Mcp\Tool\Portfolio;

use App\Entity\Portfolio\Template;
use Mcp\Capability\Attribute\McpTool;

final class ListPortfolioTemplatesTool
{
    /**
     * @return list<array{id: string, name: string}>
     */
    #[McpTool(
        name: 'list_portfolio_templates',
        description: 'List the portfolio templates available in Foliode. Use one of these identifiers when changing the current portfolio template.'
    )]
    public function __invoke(): array
    {
        $names = [
            Template::TEMPLATE_1 => 'Bento',
            Template::TEMPLATE_2 => 'Emerald',
            Template::TEMPLATE_3 => 'Prestige',
            Template::TEMPLATE_4 => 'Sunset',
        ];

        $templates = [];
        foreach (Template::getAvailableTemplates() as $template) {
            $templates[] = ['id' => $template, 'name' => $names[$template] ?? $template];
        }

        return $templates;
    }
}
