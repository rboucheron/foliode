<?php

namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePortfolioCommentDTO
{
    #[Assert\Length(max: 255, maxMessage: 'firstname cannot exceed 255 characters')]
    public ?string $firstname = null;

    #[Assert\Length(max: 255, maxMessage: 'lastname cannot exceed 255 characters')]
    public ?string $lastname = null;

    #[Assert\NotBlank(message: 'message is required.')]
    #[Assert\Length(max: 4000, maxMessage: 'message cannot exceed 4000 characters')]
    public string $message = '';
}