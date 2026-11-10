<?php

namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePortfolioLanguagesDTO
{
    /** @var array{code?: string|null, label?: string|null}|null */
    #[Assert\NotNull(message: "sourceLanguage is required.")]
    public ?array $sourceLanguage = null;

    /** @var list<array{code?: string|null, label?: string|null}>|null */
    #[Assert\NotNull(message: "languages is required.")]
    public ?array $languages = null;
}
