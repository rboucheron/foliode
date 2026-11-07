<?php

namespace App\Chat\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\ChatSuggestionContextType;

final class ChatSuggestions
{
    #[Assert\NotBlank(message: 'contextType is required.')]
    #[Assert\Choice(choices: [
        ChatSuggestionContextType::CONTEXT_GENERAL,
        ChatSuggestionContextType::CONTEXT_NOT_REGISTERED,
        ChatSuggestionContextType::CONTEXT_PORTFOLIO_UNPUBLISHED,
        ChatSuggestionContextType::CONTEXT_PORTFOLIO_PUBLISHED
    ], message: 'contextType must be general or portfolio.')]
    public string $contextType = '';
}