<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserAvatarDto
{
    #[Assert\NotBlank(message: 'image is required.')]
    #[Assert\Type(type: 'string', message: 'image must be a string.')]
    #[Assert\Length(max: 12000000, maxMessage: 'image payload is too large.')]
    #[Assert\Regex(
        pattern: '/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=\r\n]+$/',
        message: 'image must be a valid base64 data URI image (png, jpg, jpeg, webp).'
    )]
    public string $image = '';
}
