<?php

namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class SaveTranslationsDTO
{
    #[Assert\NotNull(message: "translations is required.")]
    public ?array $translations = null;
}
