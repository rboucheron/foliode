<?php

declare(strict_types=1);

namespace App\Tests\Unit\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;
use App\Portfolio\Service\TranslationHasher;
use PHPUnit\Framework\TestCase;

final class TranslationHasherTest extends TestCase
{
    public function testPortfolioHashChangesOnlyWithTranslatableFields(): void
    {
        $hasher = new TranslationHasher();
        $portfolio = (new Portfolios())->setTitle('Titre')->setSubtitle('Sous-titre')->setBio('Bio');
        $hash = $hasher->hashPortfolio($portfolio);

        self::assertSame(64, strlen($hash));

        $portfolio->setTemplate('template-2');
        self::assertSame($hash, $hasher->hashPortfolio($portfolio));

        $portfolio->setBio('Nouvelle bio');
        self::assertNotSame($hash, $hasher->hashPortfolio($portfolio));
    }

    public function testProjectHashDependsOnTitleAndDescription(): void
    {
        $hasher = new TranslationHasher();
        $project = (new Projects())->setTitle('Projet')->setDescription('Description');
        $hash = $hasher->hashProject($project);

        self::assertSame($hash, $hasher->hashProject((new Projects())->setTitle('Projet')->setDescription('Description')));

        $project->setDescription('Autre description');
        self::assertNotSame($hash, $hasher->hashProject($project));
    }
}
