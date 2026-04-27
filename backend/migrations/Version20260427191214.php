<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260427191214 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS fk_82d761851ede0f55');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS fk_5c595a3081dc659');
        $this->addSql('ALTER TABLE portfolio_views DROP CONSTRAINT IF EXISTS fk_4ca8b6c2b96b5643');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS fk_82d76185752c489c');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS fk_5c595a30752c489c');
        $this->addSql('CREATE TABLE tbl_portfolio (id UUID NOT NULL, users_id UUID NOT NULL, status INT DEFAULT NULL, title VARCHAR(255) NOT NULL, url VARCHAR(255) DEFAULT NULL, subtitle VARCHAR(255) DEFAULT NULL, author VARCHAR(255) DEFAULT NULL, bio TEXT DEFAULT NULL, config JSON DEFAULT NULL, template VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EC657FF1F47645AE ON tbl_portfolio (url)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EC657FF167B3B43D ON tbl_portfolio (users_id)');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_portfolio.users_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_project (id UUID NOT NULL, portfolio_id UUID NOT NULL, user_id UUID NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_74E0D89AB96B5643 ON tbl_project (portfolio_id)');
        $this->addSql('CREATE INDEX IDX_74E0D89AA76ED395 ON tbl_project (user_id)');
        $this->addSql('COMMENT ON COLUMN tbl_project.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project.portfolio_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project.user_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_project_image (id UUID NOT NULL, project_id UUID DEFAULT NULL, img_src TEXT NOT NULL, img_alt VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CFFA68CA166D1F9C ON tbl_project_image (project_id)');
        $this->addSql('COMMENT ON COLUMN tbl_project_image.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project_image.project_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_project_link (id UUID NOT NULL, project_id UUID DEFAULT NULL, name VARCHAR(255) NOT NULL, url TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F16E2B7F166D1F9C ON tbl_project_link (project_id)');
        $this->addSql('COMMENT ON COLUMN tbl_project_link.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN tbl_project_link.project_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_tool (id UUID NOT NULL, name VARCHAR(255) NOT NULL, picto TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN tbl_tool.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tbl_user (id UUID NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, password TEXT DEFAULT NULL, github_login VARCHAR(255) DEFAULT NULL, github_id VARCHAR(255) DEFAULT NULL, dribbble_login VARCHAR(255) DEFAULT NULL, dribbble_id VARCHAR(255) DEFAULT NULL, avatar_url TEXT DEFAULT NULL, roles JSON NOT NULL, email_verification_code VARCHAR(6) DEFAULT NULL, is_email_verified BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_38B383A1E7927C74 ON tbl_user (email)');
        $this->addSql('COMMENT ON COLUMN tbl_user.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE tbl_portfolio ADD CONSTRAINT FK_EC657FF167B3B43D FOREIGN KEY (users_id) REFERENCES tbl_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_project ADD CONSTRAINT FK_74E0D89AB96B5643 FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_project ADD CONSTRAINT FK_74E0D89AA76ED395 FOREIGN KEY (user_id) REFERENCES tbl_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_project_image ADD CONSTRAINT FK_CFFA68CA166D1F9C FOREIGN KEY (project_id) REFERENCES tbl_project (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_project_link ADD CONSTRAINT FK_F16E2B7F166D1F9C FOREIGN KEY (project_id) REFERENCES tbl_project (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_5c93b3a4a76ed395');
        $this->addSql('ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_5c93b3a4b96b5643');
        $this->addSql('ALTER TABLE portfolios DROP CONSTRAINT IF EXISTS fk_b81b226f67b3b43d');
        $this->addSql('ALTER TABLE projects_links DROP CONSTRAINT IF EXISTS fk_4403f526166d1f9c');
        $this->addSql('ALTER TABLE projects_images DROP CONSTRAINT IF EXISTS fk_21eb2295166d1f9c');
        $this->addSql('DROP TABLE projects');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE portfolios');
        $this->addSql('DROP TABLE tools');
        $this->addSql('DROP TABLE projects_links');
        $this->addSql('DROP TABLE projects_images');
        $this->addSql('ALTER TABLE portfolio_views DROP CONSTRAINT IF EXISTS FK_4CA8B6C2B96B5643');
        $this->addSql('ALTER TABLE portfolio_views ADD CONSTRAINT FK_4CA8B6C2B96B5643 FOREIGN KEY (portfolio_id) REFERENCES tbl_portfolio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS FK_82D761851EDE0F55');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS FK_82D76185752C489C');
        $this->addSql('ALTER TABLE tools_projects ADD CONSTRAINT FK_82D761851EDE0F55 FOREIGN KEY (projects_id) REFERENCES tbl_project (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_projects ADD CONSTRAINT FK_82D76185752C489C FOREIGN KEY (tools_id) REFERENCES tbl_tool (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS FK_5C595A30752C489C');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS FK_5C595A3081DC659');
        $this->addSql('ALTER TABLE tools_portfolios ADD CONSTRAINT FK_5C595A30752C489C FOREIGN KEY (tools_id) REFERENCES tbl_tool (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_portfolios ADD CONSTRAINT FK_5C595A3081DC659 FOREIGN KEY (portfolios_id) REFERENCES tbl_portfolio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE portfolio_views DROP CONSTRAINT IF EXISTS FK_4CA8B6C2B96B5643');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS FK_5C595A3081DC659');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS FK_82D761851EDE0F55');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS FK_82D76185752C489C');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS FK_5C595A30752C489C');
        $this->addSql('CREATE TABLE projects (id UUID NOT NULL, portfolio_id UUID NOT NULL, user_id UUID NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_5c93b3a4a76ed395 ON projects (user_id)');
        $this->addSql('CREATE INDEX idx_5c93b3a4b96b5643 ON projects (portfolio_id)');
        $this->addSql('COMMENT ON COLUMN projects.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projects.portfolio_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projects.user_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE users (id UUID NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, password TEXT DEFAULT NULL, github_login VARCHAR(255) DEFAULT NULL, github_id VARCHAR(255) DEFAULT NULL, dribbble_login VARCHAR(255) DEFAULT NULL, dribbble_id VARCHAR(255) DEFAULT NULL, avatar_url TEXT DEFAULT NULL, roles JSON NOT NULL, email_verification_code VARCHAR(6) DEFAULT NULL, is_email_verified BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_1483a5e9e7927c74 ON users (email)');
        $this->addSql('COMMENT ON COLUMN users.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE portfolios (id UUID NOT NULL, users_id UUID NOT NULL, title VARCHAR(255) NOT NULL, url VARCHAR(255) DEFAULT NULL, subtitle VARCHAR(255) DEFAULT NULL, bio TEXT DEFAULT NULL, config JSON DEFAULT NULL, template VARCHAR(255) NOT NULL, status INT DEFAULT NULL, author VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_b81b226f67b3b43d ON portfolios (users_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_b81b226ff47645ae ON portfolios (url)');
        $this->addSql('COMMENT ON COLUMN portfolios.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN portfolios.users_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE tools (id UUID NOT NULL, name VARCHAR(255) NOT NULL, picto TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN tools.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE projects_links (id UUID NOT NULL, project_id UUID DEFAULT NULL, name VARCHAR(255) NOT NULL, url TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_4403f526166d1f9c ON projects_links (project_id)');
        $this->addSql('COMMENT ON COLUMN projects_links.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projects_links.project_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE projects_images (id UUID NOT NULL, project_id UUID DEFAULT NULL, img_src TEXT NOT NULL, img_alt VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_21eb2295166d1f9c ON projects_images (project_id)');
        $this->addSql('COMMENT ON COLUMN projects_images.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projects_images.project_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE projects ADD CONSTRAINT fk_5c93b3a4a76ed395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE projects ADD CONSTRAINT fk_5c93b3a4b96b5643 FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE portfolios ADD CONSTRAINT fk_b81b226f67b3b43d FOREIGN KEY (users_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE projects_links ADD CONSTRAINT fk_4403f526166d1f9c FOREIGN KEY (project_id) REFERENCES projects (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE projects_images ADD CONSTRAINT fk_21eb2295166d1f9c FOREIGN KEY (project_id) REFERENCES projects (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tbl_portfolio DROP CONSTRAINT IF EXISTS FK_EC657FF167B3B43D');
        $this->addSql('ALTER TABLE tbl_project DROP CONSTRAINT IF EXISTS FK_74E0D89AB96B5643');
        $this->addSql('ALTER TABLE tbl_project DROP CONSTRAINT IF EXISTS FK_74E0D89AA76ED395');
        $this->addSql('ALTER TABLE tbl_project_image DROP CONSTRAINT IF EXISTS FK_CFFA68CA166D1F9C');
        $this->addSql('ALTER TABLE tbl_project_link DROP CONSTRAINT IF EXISTS FK_F16E2B7F166D1F9C');
        $this->addSql('DROP TABLE tbl_portfolio');
        $this->addSql('DROP TABLE tbl_project');
        $this->addSql('DROP TABLE tbl_project_image');
        $this->addSql('DROP TABLE tbl_project_link');
        $this->addSql('DROP TABLE tbl_tool');
        $this->addSql('DROP TABLE tbl_user');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS fk_82d76185752c489c');
        $this->addSql('ALTER TABLE tools_projects DROP CONSTRAINT IF EXISTS fk_82d761851ede0f55');
        $this->addSql('ALTER TABLE tools_projects ADD CONSTRAINT fk_82d76185752c489c FOREIGN KEY (tools_id) REFERENCES tools (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_projects ADD CONSTRAINT fk_82d761851ede0f55 FOREIGN KEY (projects_id) REFERENCES projects (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS fk_5c595a30752c489c');
        $this->addSql('ALTER TABLE tools_portfolios DROP CONSTRAINT IF EXISTS fk_5c595a3081dc659');
        $this->addSql('ALTER TABLE tools_portfolios ADD CONSTRAINT fk_5c595a30752c489c FOREIGN KEY (tools_id) REFERENCES tools (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tools_portfolios ADD CONSTRAINT fk_5c595a3081dc659 FOREIGN KEY (portfolios_id) REFERENCES portfolios (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE portfolio_views DROP CONSTRAINT IF EXISTS fk_4ca8b6c2b96b5643');
        $this->addSql('ALTER TABLE portfolio_views ADD CONSTRAINT fk_4ca8b6c2b96b5643 FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
