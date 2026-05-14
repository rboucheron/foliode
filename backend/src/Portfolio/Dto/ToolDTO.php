<?php

namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ToolDTO
{
    #[Assert\NotBlank(message: 'name is required.')]
    #[Assert\Length(max: 255, maxMessage: 'name cannot exceed 255 characters.')]
    public string $name = '';

    #[Assert\Type(type: 'string', message: 'image must be a string.')]
    #[Assert\Length(max: 12000000, maxMessage: 'image payload is too large.')]
    #[Assert\Regex(
        pattern: '/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=\r\n]+$/',
        message: 'image must be a valid base64 data URI image (png, jpg, jpeg, webp).'
    )]
    public ?string $image = null;
}
