<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260426101500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add status and author columns to portfolios table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE portfolios ADD status INT DEFAULT NULL');
        $this->addSql('ALTER TABLE portfolios ADD author VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE portfolios DROP status');
        $this->addSql('ALTER TABLE portfolios DROP author');
    }
}
