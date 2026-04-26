<?php

namespace App\Entity\Portfolio;

class TemplateConfig
{
    private const TEMPLATECONFIG_1 = [
        'color' => [],
        'font' => 'Arial',
    ];

    private const TEMPLATEFONT_PROVIDER = ['fonts.googleapis.com'];

    public static function defindeTemplateConfig(): array
    {
        $templateColor = new TemplateColor();
        $templateConfig = self::TEMPLATECONFIG_1;

        $templateConfig['color'] = $templateColor->getTemplateColor();

        return [
            $templateConfig,
        ];
    }

    public static function definedColor(TemplateColor $templateColor, array $templateConfig): array
    {
        $templateConfig = $templateConfig ?: self::TEMPLATECONFIG_1;

        $templateConfig['color'] = $templateColor->getTemplateColor();

        return [
            $templateConfig,
        ];
    }

    public static function definedFont(array $templateFont, array $templateConfig): array
    {
        $templateConfig = $templateConfig ?: self::TEMPLATECONFIG_1;

        if (in_array($templateFont['provider'], self::TEMPLATEFONT_PROVIDER)) {
            $templateConfig['font'] = [
                'family' => $templateFont['family'],
                'provider' => $templateFont['provider'],
            ];
        }

        return [
            $templateConfig,
        ];

    }


}