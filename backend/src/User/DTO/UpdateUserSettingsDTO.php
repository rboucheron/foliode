<?php

namespace App\User\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdateUserSettingsDTO
{
    public function __construct(#[Assert\NotNull] public bool $multiSiteEnabled) {}
}
