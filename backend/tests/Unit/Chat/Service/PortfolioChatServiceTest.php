<?php

namespace App\Tests\Unit\Chat\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;
use App\Chat\Service\PortfolioChatService;
use PHPUnit\Framework\TestCase;

final class PortfolioChatServiceTest extends TestCase
{
    public function testItUsesAIMLRulesToListProjects(): void
    {
        $portfolio = (new Portfolios())
            ->setTitle('Portfolio de Raphaël')
            ->setBio('Développeur logiciel');
        $portfolio->addProject(
            (new Projects())
                ->setTitle('Foliode')
                ->setDescription('Une plateforme de portfolio.')
        );

        $service = new PortfolioChatService(__DIR__.'/../../../../config/aiml/foliode.aiml');

        $answer = $service->answer($portfolio, 'bonjour agent foliode quels sont mes projets');

        self::assertStringContainsString('Foliode', $answer);
        self::assertStringContainsString('Une plateforme de portfolio.', $answer);
    }

    public function testItSupportsNestedConditionsForAnEmptyPortfolio(): void
    {
        $service = new PortfolioChatService(__DIR__.'/../../../../config/aiml/foliode.aiml');

        $answer = $service->answer(new Portfolios(), 'quels sont mes projets');

        self::assertSame('Votre portfolio ne contient encore aucun projet.', $answer);
    }

    public function testItAnswersDescriptionAdviceWithoutAnExternalProvider(): void
    {
        $service = new PortfolioChatService(__DIR__.'/../../../../config/aiml/foliode.aiml');

        $answer = $service->answer(new Portfolios(), 'bonjour agent foliode des conseils pour améliorer la description');

        self::assertStringContainsString('problème résolu', $answer);
        self::assertStringContainsString('technologies utilisées', $answer);
    }
}
