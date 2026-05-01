<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260426202944 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE portfolio_views ALTER portfolio_id SET NOT NULL');
        $this->addSql('ALTER TABLE portfolio_views ALTER date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE portfolios ADD status INT DEFAULT NULL');
        $this->addSql('ALTER TABLE portfolios ADD author VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE portfolios ALTER template SET NOT NULL');
        $this->addSql('ALTER TABLE projects ADD user_id UUID NOT NULL');
        $this->addSql('COMMENT ON COLUMN projects.user_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE projects ADD CONSTRAINT FK_5C93B3A4A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_5C93B3A4A76ED395 ON projects (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE projects DROP CONSTRAINT FK_5C93B3A4A76ED395');
        $this->addSql('DROP INDEX IDX_5C93B3A4A76ED395');
        $this->addSql('ALTER TABLE projects DROP user_id');
        $this->addSql('ALTER TABLE portfolios DROP status');
        $this->addSql('ALTER TABLE portfolios DROP author');
        $this->addSql('ALTER TABLE portfolios ALTER template DROP NOT NULL');
        $this->addSql('ALTER TABLE portfolio_views ALTER portfolio_id DROP NOT NULL');
        $this->addSql('ALTER TABLE portfolio_views ALTER date TYPE DATE');
    }
}
