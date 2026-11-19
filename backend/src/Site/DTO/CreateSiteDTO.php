<?php

namespace App\Site\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateSiteDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        public string $title,
    ) {}
}
