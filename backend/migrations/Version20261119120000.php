<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261119120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Enable multiple sites per user and add JSON-backed dynamic content.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE tbl_user ADD multi_site_enabled BOOLEAN DEFAULT FALSE NOT NULL');
        $this->addSql('DROP INDEX IF EXISTS UNIQ_EC657FF167B3B43D');
        $this->addSql('CREATE INDEX IDX_EC657FF167B3B43D ON tbl_portfolio (users_id)');
        $this->addSql('CREATE TABLE custom_type (id UUID NOT NULL, site_id UUID NOT NULL, name VARCHAR(120) NOT NULL, layout VARCHAR(10) NOT NULL, fields JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9AB3F6F3C5D5B6A5 ON custom_type (site_id)');
        $this->addSql('ALTER TABLE custom_type ADD CONSTRAINT FK_9AB3F6F3C5D5B6A5 FOREIGN KEY (site_id) REFERENCES tbl_portfolio (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE TABLE custom_entry (id UUID NOT NULL, custom_type_id UUID NOT NULL, values JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7B0A4D08C5D5B6A5 ON custom_entry (custom_type_id)');
        $this->addSql('ALTER TABLE custom_entry ADD CONSTRAINT FK_7B0A4D08C5D5B6A5 FOREIGN KEY (custom_type_id) REFERENCES custom_type (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE custom_entry DROP CONSTRAINT FK_7B0A4D08C5D5B6A5');
        $this->addSql('DROP TABLE custom_entry');
        $this->addSql('ALTER TABLE custom_type DROP CONSTRAINT FK_9AB3F6F3C5D5B6A5');
        $this->addSql('DROP TABLE custom_type');
        $this->addSql('DROP INDEX IF EXISTS IDX_EC657FF167B3B43D');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EC657FF167B3B43D ON tbl_portfolio (users_id)');
        $this->addSql('ALTER TABLE tbl_user DROP multi_site_enabled');
    }
}
