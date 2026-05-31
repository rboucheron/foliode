<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260531151910 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tbl_portfolio_comment (id UUID NOT NULL, portfolio_id UUID NOT NULL, user_id UUID DEFAULT NULL, visitor_id UUID DEFAULT NULL, message TEXT NOT NULL, status INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, hidden_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7CC0B330B96B5643 ON tbl_portfolio_comment (portfolio_id)');
        $this->addSql('CREATE INDEX IDX_7CC0B330A76ED395 ON tbl_portfolio_comment (user_id)');
        $this->addSql('CREATE INDEX IDX_7CC0B33070BEE6D ON tbl_portfolio_comment (visitor_id)');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_comment.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_comment.portfolio_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_comment.user_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_comment.visitor_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_portfolio_visitor (id UUID NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, avatar_url TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio_visitor.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_7CC0B330B96B5643 FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_7CC0B330A76ED395 FOREIGN KEY (user_id) REFERENCES tbl_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_7CC0B33070BEE6D FOREIGN KEY (visitor_id) REFERENCES tbl_portfolio_visitor (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_portfolio ADD comment_message TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP CONSTRAINT FK_7CC0B330B96B5643');
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP CONSTRAINT FK_7CC0B330A76ED395');
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP CONSTRAINT FK_7CC0B33070BEE6D');
        $this->addSql('DROP TABLE tbl_portfolio_comment');
        $this->addSql('DROP TABLE tbl_portfolio_visitor');
        $this->addSql('ALTER TABLE tbl_portfolio DROP comment_message');
    }
}
