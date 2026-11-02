<?php

namespace App\Chat\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class PortfolioChatRequest
{
    #[Assert\NotBlank(message: 'message is required.')]
    #[Assert\Length(
        min: 2,
        max: 4000,
        minMessage: 'message must contain at least 2 characters.',
        maxMessage: 'message cannot exceed 4000 characters.'
    )]
    public string $message = '';
}
