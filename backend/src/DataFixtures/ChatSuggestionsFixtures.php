<?php

namespace App\DataFixtures;

use App\Entity\ChatSuggestions;
use App\Entity\Portfolio\ChatSuggestionContextType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

final class ChatSuggestionsFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $suggestions = [
            ChatSuggestionContextType::CONTEXT_GENERAL => [
                'chat.suggestion.general.1' => 'Comment fonctionne ce portfolio ?',
                'chat.suggestion.general.2' => 'Quelles sont les compétences présentées ?',
                'chat.suggestion.general.3' => 'Quels sont les projets disponibles ?',
                'chat.suggestion.general.4' => 'Peux-tu me présenter le propriétaire de ce portfolio ?',
                'chat.suggestion.general.5' => 'Quels sont les domaines d’expertise présentés ?',
                'chat.suggestion.general.6' => 'Quels projets sont les plus intéressants ?',
                'chat.suggestion.general.7' => 'Quelles technologies sont utilisées dans les projets ?',
                'chat.suggestion.general.8' => 'Peux-tu résumer ce portfolio ?',
                'chat.suggestion.general.9' => 'Comment contacter le propriétaire du portfolio ?',
            ],

            ChatSuggestionContextType::CONTEXT_NOT_REGISTERED => [
                'chat.suggestion.not_registered.1' => 'Comment créer un compte ?',
                'chat.suggestion.not_registered.2' => 'Quels sont les avantages de créer un compte ?',
                'chat.suggestion.not_registered.3' => 'Comment créer mon propre portfolio ?',
                'chat.suggestion.not_registered.4' => 'Puis-je personnaliser mon portfolio ?',
                'chat.suggestion.not_registered.5' => 'Comment ajouter mes compétences ?',
                'chat.suggestion.not_registered.6' => 'Comment ajouter un projet à mon portfolio ?',
                'chat.suggestion.not_registered.7' => 'Puis-je modifier mon portfolio à tout moment ?',
                'chat.suggestion.not_registered.8' => 'Comment rendre mon portfolio visible ?',
                'chat.suggestion.not_registered.9' => 'Comment gérer les informations de mon profil ?',
            ],

            ChatSuggestionContextType::CONTEXT_PORTFOLIO_UNPUBLISHED => [
                'chat.suggestion.portfolio_unpublished.1' => 'Comment publier mon portfolio ?',
                'chat.suggestion.portfolio_unpublished.2' => 'Pourquoi mon portfolio n’est-il pas encore publié ?',
                'chat.suggestion.portfolio_unpublished.3' => 'Comment prévisualiser mon portfolio ?',
                'chat.suggestion.portfolio_unpublished.4' => 'Quelles informations dois-je compléter avant publication ?',
                'chat.suggestion.portfolio_unpublished.5' => 'Comment modifier mon template ?',
                'chat.suggestion.portfolio_unpublished.6' => 'Comment ajouter un nouveau projet ?',
                'chat.suggestion.portfolio_unpublished.7' => 'Comment supprimer un projet ?',
                'chat.suggestion.portfolio_unpublished.8' => 'Comment modifier mes compétences et expériences ?',
                'chat.suggestion.portfolio_unpublished.9' => 'Puis-je annuler la publication de mon portfolio ?',
            ],

            ChatSuggestionContextType::CONTEXT_PORTFOLIO_PUBLISHED => [
                'chat.suggestion.portfolio_published.1' => 'Comment partager mon portfolio ?',
                'chat.suggestion.portfolio_published.2' => 'Comment modifier mon portfolio publié ?',
                'chat.suggestion.portfolio_published.3' => 'Comment changer mon template ?',
                'chat.suggestion.portfolio_published.4' => 'Comment ajouter un nouveau projet ?',
                'chat.suggestion.portfolio_published.5' => 'Comment mettre à jour mes compétences ?',
                'chat.suggestion.portfolio_published.6' => 'Comment améliorer la visibilité de mon portfolio ?',
                'chat.suggestion.portfolio_published.7' => 'Puis-je consulter les statistiques de mon portfolio ?',
                'chat.suggestion.portfolio_published.8' => 'Comment mettre à jour mes informations personnelles ?',
                'chat.suggestion.portfolio_published.9' => 'Comment dépublier temporairement mon portfolio ?',
            ],
        ];

        foreach ($suggestions as $contextType => $contextSuggestions) {
            foreach ($contextSuggestions as $translationKey => $description) {
                $chatSuggestion = (new ChatSuggestions())
                    ->setDescription($description)
                    ->setTranslationKey($translationKey)
                    ->setIsActive(true)
                    ->setContextType($contextType);

                $manager->persist($chatSuggestion);
            }
        }

        $manager->flush();
    }
}