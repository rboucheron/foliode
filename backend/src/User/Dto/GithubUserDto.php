<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class GithubUserDto
{
    #[Assert\NotBlank(message: "email should not be blank")]
    #[Assert\Email(message: "email format is invalid.")]
    public string $email;
    #[Assert\NotBlank(message: "token should not be blank")]
    public string $token;
}