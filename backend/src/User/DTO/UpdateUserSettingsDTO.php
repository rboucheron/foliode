<?php

namespace App\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdateUserSettingsDTO
{
    public function __construct(#[Assert\NotNull] public bool $multiSiteEnabled) {}
}
