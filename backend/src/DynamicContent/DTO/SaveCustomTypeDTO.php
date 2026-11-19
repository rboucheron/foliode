<?php

namespace App\DynamicContent\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class SaveCustomTypeDTO
{
    public function __construct(
        #[Assert\NotBlank, Assert\Length(max: 120)] public string $name,
        #[Assert\Choice(['list', 'grid', 'cards'])] public string $layout = 'list',
        #[Assert\Type('array')] public array $fields = [],
    ) {}
}
