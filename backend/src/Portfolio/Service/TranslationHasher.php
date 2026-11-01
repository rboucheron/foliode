<?php

namespace App\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;

class TranslationHasher
{
    public function hashPortfolio(Portfolios $portfolio): string
    {
        return $this->hash([$portfolio->getTitle(), $portfolio->getSubtitle(), $portfolio->getBio()]);
    }

    public function hashProject(Projects $project): string
    {
        return $this->hash([$project->getTitle(), $project->getDescription()]);
    }

    private function hash(array $values): string
    {
        return hash('sha256', (string) json_encode($values, JSON_UNESCAPED_UNICODE));
    }
}
