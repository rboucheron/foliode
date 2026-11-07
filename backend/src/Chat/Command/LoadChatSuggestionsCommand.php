<?php

namespace App\Chat\Command;

use App\Entity\ChatSuggestions;
use App\Entity\ChatSuggestionContextType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:chat-suggestions:load',
    description: 'Initializes chatbot suggestions in the database.'
)]
final class LoadChatSuggestionsCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {
        $io = new SymfonyStyle($input, $output);

        $suggestions = [
            ChatSuggestionContextType::CONTEXT_GENERAL => [
                'How does this portfolio work?',
                'What skills are presented?',
                'What projects are available?',
                'Can you introduce the portfolio owner?',
                'What are the main areas of expertise?',
                'Which projects are the most interesting?',
                'What technologies are used in these projects?',
                'Can you summarize this portfolio?',
                'How can I contact the portfolio owner?',
            ],
            ChatSuggestionContextType::CONTEXT_NOT_REGISTERED => [
                'How can I create an account?',
                'What are the benefits of creating an account?',
                'How can I create my own portfolio?',
                'Can I customize my portfolio?',
                'How can I add my skills?',
                'How can I add a project to my portfolio?',
                'Can I edit my portfolio at any time?',
                'How can I make my portfolio visible?',
                'How can I manage my profile information?',
            ],
            ChatSuggestionContextType::CONTEXT_PORTFOLIO_UNPUBLISHED => [
                'How can I publish my portfolio?',
                'Why is my portfolio not published yet?',
                'How can I preview my portfolio?',
                'What information should I complete before publishing?',
                'How can I change my template?',
                'How can I add a new project?',
                'How can I delete a project?',
                'How can I update my skills and experience?',
                'Can I cancel my portfolio publication?',
            ],
            ChatSuggestionContextType::CONTEXT_PORTFOLIO_PUBLISHED => [
                'How can I share my portfolio?',
                'How can I edit my published portfolio?',
                'How can I change my template?',
                'How can I add a new project?',
                'How can I update my skills?',
                'How can I improve my portfolio visibility?',
                'Can I view my portfolio statistics?',
                'How can I update my personal information?',
                'How can I temporarily unpublish my portfolio?',
            ],
        ];

        $repository = $this->entityManager->getRepository(ChatSuggestions::class);

        $created = 0;
        $skipped = 0;

        foreach ($suggestions as $contextType => $descriptions) {
            foreach ($descriptions as $index => $description) {
                $translationKey = sprintf(
                    'chat.suggestion.%s.%d',
                    $contextType,
                    $index + 1
                );

                $existing = $repository->findOneBy([
                    'translation_key' => $translationKey,
                ]);

                if ($existing !== null) {
                    ++$skipped;
                    continue;
                }

                $suggestion = (new ChatSuggestions())
                    ->setDescription($description)
                    ->setTranslationKey($translationKey)
                    ->setIsActive(true)
                    ->setContextType($contextType);

                $this->entityManager->persist($suggestion);

                ++$created;
            }
        }

        $this->entityManager->flush();

        $io->success(sprintf(
            'Initialization completed: %d suggestions created, %d existing suggestions skipped.',
            $created,
            $skipped
        ));

        return Command::SUCCESS;
    }
}
