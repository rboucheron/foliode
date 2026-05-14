<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserProfileDto
{
    #[Assert\Email(message: 'email format is invalid.')]
    public ?string $email = null;

    #[Assert\Length(max: 255, maxMessage: 'firstName cannot exceed 255 characters.')]
    #[Assert\Regex(
        pattern: '/^[\p{L}\s\-\']+$/u',
        message: 'firstName should contain only letters, spaces, hyphens and apostrophes.'
    )]
    public ?string $firstName = null;

    #[Assert\Length(max: 255, maxMessage: 'lastName cannot exceed 255 characters.')]
    #[Assert\Regex(
        pattern: '/^[\p{L}\s\-\']+$/u',
        message: 'lastName should contain only letters, spaces, hyphens and apostrophes.'
    )]
    public ?string $lastName = null;
}
