<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261031120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add portfolio languages, portfolio translations and project translations';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE tbl_portfolio_language (id UUID NOT NULL, portfolio_id UUID NOT NULL, code VARCHAR(64) NOT NULL, label VARCHAR(100) DEFAULT NULL, is_source BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B6EED88BB96B5643 ON tbl_portfolio_language (portfolio_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_portfolio_language_code ON tbl_portfolio_language (portfolio_id, code)');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_language.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_language.portfolio_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_language.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE tbl_portfolio_translation (id UUID NOT NULL, portfolio_id UUID NOT NULL, language VARCHAR(64) NOT NULL, title VARCHAR(255) NOT NULL, subtitle VARCHAR(255) DEFAULT NULL, bio TEXT DEFAULT NULL, source_hash VARCHAR(64) NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B3EA4E14B96B5643 ON tbl_portfolio_translation (portfolio_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_portfolio_translation_language ON tbl_portfolio_translation (portfolio_id, language)');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_translation.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_translation.portfolio_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_translation.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE tbl_project_translation (id UUID NOT NULL, project_id UUID NOT NULL, language VARCHAR(64) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, source_hash VARCHAR(64) NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_430D0BBA166D1F9C ON tbl_project_translation (project_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_project_translation_language ON tbl_project_translation (project_id, language)');
        $this->addSql('COMMENT ON COLUMN tbl_project_translation.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project_translation.project_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project_translation.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE tbl_portfolio_language ADD CONSTRAINT FK_B6EED88BB96B5643 FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_portfolio_translation ADD CONSTRAINT FK_B3EA4E14B96B5643 FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_project_translation ADD CONSTRAINT FK_430D0BBA166D1F9C FOREIGN KEY (project_id) REFERENCES tbl_project (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE tbl_portfolio_language DROP CONSTRAINT FK_B6EED88BB96B5643');
        $this->addSql('ALTER TABLE tbl_portfolio_translation DROP CONSTRAINT FK_B3EA4E14B96B5643');
        $this->addSql('ALTER TABLE tbl_project_translation DROP CONSTRAINT FK_430D0BBA166D1F9C');
        $this->addSql('DROP TABLE tbl_portfolio_language');
        $this->addSql('DROP TABLE tbl_portfolio_translation');
        $this->addSql('DROP TABLE tbl_project_translation');
    }
}
