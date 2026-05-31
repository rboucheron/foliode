<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateUsersDto
{
    #[Assert\NotBlank(message: "email should not be blank")]
    #[Assert\Email(message: "email format is invalid.")]
    public string $email;
    #[Assert\NotBlank(message: "first name should not be blank")]
    #[Assert\Regex(
        pattern: '/^[\p{L}\s]+$/u',
        message: 'first name should contain only letters and spaces.'
    )]
    public string $firstName;
    #[Assert\NotBlank(message: "name should not be blank")]
    #[Assert\Regex(
        pattern: '/^[\p{L}\s]+$/u',
        message: 'name should contain only letters and spaces.'
    )]
    public string $lastName;
    #[Assert\NotBlank(message: "password should not be blank")]
    #[Assert\Length(
        min: 8,
        minMessage: "password must have at least 10 characters."
    )]
    public string $password;
}