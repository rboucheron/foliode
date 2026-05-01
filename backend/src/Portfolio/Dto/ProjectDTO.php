<?php
namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ProjectDTO
{
    #[Assert\NotBlank(message: "The name is required.")]
    #[Assert\Length(max: 255, maxMessage: "title cannot exceed 255 characters")]
    public string $title = '';
    public ?string $description = null;
    #[Assert\Type(type: 'array', message: 'images must be an array.')]
    #[Assert\All([
        new Assert\Collection(
            fields: [
                'file' => [
                    new Assert\NotBlank(message: 'file is required.'),
                    new Assert\Type(type: 'string', message: 'file must be a string.'),
                ],
                'imageAlt' => [
                    new Assert\NotBlank(message: 'imageAlt is required.'),
                    new Assert\Type(type: 'string', message: 'imageAlt must be a string.'),
                ],
            ],
            allowExtraFields: false,
            allowMissingFields: false,
        ),
    ])]
    public array $images = [];
    #[Assert\Type(type: 'array', message: 'links must be an array.')]
    #[Assert\All([
        new Assert\Collection(
            fields: [
                'name' => [
                    new Assert\NotBlank(message: 'name is required.'),
                    new Assert\Type(type: 'string', message: 'name must be a string.'),
                ],
                'url' => [
                    new Assert\NotBlank(message: 'url is required.'),
                    new Assert\Type(type: 'string', message: 'url must be a string.'),
                ],
            ],
            allowExtraFields: false,
            allowMissingFields: false,
        ),
    ])]
    public array $links = [];
}

