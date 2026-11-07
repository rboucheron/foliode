<?php

namespace App\Entity\Portfolio;

class ChatSuggestionContextType
{
    public const CONTEXT_GENERAL = 'general';
    public const CONTEXT_NOT_REGISTERED = 'not_registered';
    public const CONTEXT_PORTFOLIO_UNPUBLISHED = 'portfolio_unpublished';
    public const CONTEXT_PORTFOLIO_PUBLISHED = 'portfolio_published';



    public static function getAllContextTypes(): array
    {
        return [
            self::CONTEXT_GENERAL,
            self::CONTEXT_NOT_REGISTERED,
            self::CONTEXT_PORTFOLIO_UNPUBLISHED,
            self::CONTEXT_PORTFOLIO_PUBLISHED,

        ];
    }
}
