<?php

namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePortfolioLanguagesDTO
{
    #[Assert\NotNull(message: "sourceLanguage is required.")]
    public ?array $sourceLanguage = null;

    #[Assert\NotNull(message: "languages is required.")]
    public ?array $languages = null;
}
