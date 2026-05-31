<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260531120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add portfolio comments, visitors and comment message support.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE tbl_portfolio ADD comment_message LONGTEXT DEFAULT NULL');
        $this->addSql('CREATE TABLE tbl_portfolio_visitor (id CHAR(36) NOT NULL COMMENT "(DC2Type:uuid)", firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, avatar_url LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tbl_portfolio_comment (id CHAR(36) NOT NULL COMMENT "(DC2Type:uuid)", portfolio_id CHAR(36) NOT NULL COMMENT "(DC2Type:uuid)", user_id CHAR(36) DEFAULT NULL COMMENT "(DC2Type:uuid)", visitor_id CHAR(36) DEFAULT NULL COMMENT "(DC2Type:uuid)", message LONGTEXT NOT NULL, status INT NOT NULL, created_at DATETIME NOT NULL, hidden_at DATETIME DEFAULT NULL, INDEX IDX_3A3B8F7B6C6A3D9E (portfolio_id), INDEX IDX_3A3B8F7BA76ED395 (user_id), INDEX IDX_3A3B8F7B7C4A9A7E (visitor_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_3A3B8F7B6C6A3D9E FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id)');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_3A3B8F7BA76ED395 FOREIGN KEY (user_id) REFERENCES tbl_user (id)');
        $this->addSql('ALTER TABLE tbl_portfolio_comment ADD CONSTRAINT FK_3A3B8F7B7C4A9A7E FOREIGN KEY (visitor_id) REFERENCES tbl_portfolio_visitor (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP FOREIGN KEY FK_3A3B8F7B6C6A3D9E');
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP FOREIGN KEY FK_3A3B8F7BA76ED395');
        $this->addSql('ALTER TABLE tbl_portfolio_comment DROP FOREIGN KEY FK_3A3B8F7B7C4A9A7E');
        $this->addSql('DROP TABLE tbl_portfolio_comment');
        $this->addSql('DROP TABLE tbl_portfolio_visitor');
        $this->addSql('ALTER TABLE tbl_portfolio DROP comment_message');
    }
}