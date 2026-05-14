<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AuthUserDto
{
    #[Assert\NotBlank(message: "email should not be blank")]
    public string $email;
    #[Assert\NotBlank(message: "password should not be blank")]
    public string $password;
}