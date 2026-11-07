<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261107154500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add context type to chat suggestions';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE chat_suggestions ADD context_type VARCHAR(255) NOT NULL DEFAULT 'general'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE chat_suggestions DROP context_type');
    }
}
