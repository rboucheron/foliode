<?php

namespace App\DynamicContent\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class SaveCustomEntryDTO
{
    public function __construct(#[Assert\Type('array')] public array $values = []) {}
}
