<?php 

namespace App\Entity\Portfolio;

class Template
{
    public const TEMPLATE_1 = 'template-1';
    public const TEMPLATE_2 = 'template-2';
    public const TEMPLATE_3 = 'template-3';

    public static function getAvailableTemplates(): array
    {
        return [
            self::TEMPLATE_1,
            self::TEMPLATE_2,
            self::TEMPLATE_3,
        ];
    }

    public static function getCurrentTemplate(int $templateId): string
    {
        $templates = self::getAvailableTemplates();

        if (isset($templates[$templateId])) {
            return $templates[$templateId];
        }

        return self::TEMPLATE_1;
    }
}