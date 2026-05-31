<?php

namespace App\Entity\Portfolio;

class PortfolioCommentStatus
{
    public const HIDDEN = 0;
    public const VISIBLE = 1;

    public static function getStatusLabel(int $status): string
    {
        return match ($status) {
            self::HIDDEN => 'Hidden',
            self::VISIBLE => 'Visible',
            default => 'Unknown',
        };
    }
}