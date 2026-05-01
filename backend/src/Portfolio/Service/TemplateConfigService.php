<?php
namespace App\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\TemplateColor;
use App\Entity\Portfolio\TemplateConfig;
use App\Portfolio\Dto\TemplateColorConfigDTO;
use App\Portfolio\Dto\TemplateFontConfigDTO;

class TemplateConfigService
{
    public function __construct()
    {
    }

    public function getTemplateConfig(): array
    {
        return TemplateConfig::defindeTemplateConfig();
    }

    public function updateTemplateColor(TemplateColorConfigDTO $templateColorConfigDTO, Portfolios $portfolio): array
    {
        $templateColor = (new TemplateColor())
            ->setPrimary($templateColorConfigDTO->primary)
            ->setSecondary($templateColorConfigDTO->secondary)
            ->setWarning($templateColorConfigDTO->warning)
            ->setSuccess($templateColorConfigDTO->success)
            ->setInfo($templateColorConfigDTO->info)
            ->setLight($templateColorConfigDTO->light)
            ->setDark($templateColorConfigDTO->dark);


        return TemplateConfig::definedColor($templateColor, $portfolio->getConfig());
    }

    public function updateTemplateFont(TemplateFontConfigDTO $templateFontConfigDTO, Portfolios $portfolios): array
    {
        return TemplateConfig::definedFont(
            [
                'family' => $templateFontConfigDTO->family,
                'provider' => $templateFontConfigDTO->provider,
            ],
            $portfolios->getConfig()
        );
    }
}