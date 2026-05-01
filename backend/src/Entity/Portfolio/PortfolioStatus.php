<?php 

namespace App\Entity\Portfolio;

class PortfolioStatus
{
    public const DRAFT = 0;
    public const PUBLISHED = 1;
    public const ARCHIVED = 2;

    public static function getStatusLabel(int $status): string
    {
        return match ($status) {
            self::DRAFT => 'Draft',
            self::PUBLISHED => 'Published',
            self::ARCHIVED => 'Archived',
            default => 'Unknown',
        };
    }
}