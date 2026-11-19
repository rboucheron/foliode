<?php

namespace App\DynamicContent\Service;

use App\DynamicContent\DTO\SaveCustomEntryDTO;
use App\DynamicContent\DTO\SaveCustomTypeDTO;
use App\DynamicContent\Entity\CustomEntry;
use App\DynamicContent\Entity\CustomType;
use App\DynamicContent\Repository\CustomEntryRepository;
use App\DynamicContent\Repository\CustomTypeRepository;
use App\Entity\Users;
use App\Site\Service\SiteService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class DynamicContentService
{
    private const FIELD_TYPES = ['text', 'textarea', 'date', 'url'];
    private const LAYOUTS = ['list', 'grid', 'cards'];

    public function __construct(
        private SiteService $sites,
        private CustomTypeRepository $types,
        private CustomEntryRepository $entries,
        private EntityManagerInterface $em
    ) {
    }

    /** @return list<CustomType> */
    public function listTypes(Users $user, string $siteId): array
    {
        return $this->types->findBy(['site' => $this->sites->get($user, $siteId)]);
    }

    public function saveType(Users $user, string $siteId, SaveCustomTypeDTO $dto, ?string $typeId = null): CustomType
    {
        if (!in_array($dto->layout, self::LAYOUTS, true)) {
            throw new BadRequestHttpException('Invalid layout.');
        }
        $fields = [];
        foreach ($dto->fields as $index => $field) {
            if (!is_array($field) || !is_string($field['label'] ?? null) || !is_string($field['key'] ?? null) || !in_array($field['type'] ?? null, self::FIELD_TYPES, true)) {
                throw new BadRequestHttpException('Each field needs a key, label and supported type.');
            }
            $fields[] = ['key' => $field['key'], 'label' => $field['label'], 'type' => $field['type'], 'visible' => (bool) ($field['visible'] ?? true), 'order' => (int) ($field['order'] ?? $index)];
        }
        $type = $typeId ? $this->getType($user, $siteId, $typeId) : (new CustomType())->setSite($this->sites->get($user, $siteId));
        $type->setName($dto->name)->setLayout($dto->layout)->setFields($fields);
        $this->em->persist($type);
        $this->em->flush();
        return $type;
    }

    public function getType(Users $user, string $siteId, string $typeId): CustomType
    {
        $type = $this->types->findOneBy(['id' => $typeId, 'site' => $this->sites->get($user, $siteId)]);
        if (!$type instanceof CustomType) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('Type not found.');
        }
        return $type;
    }

    /** @return list<CustomEntry> */
    public function listEntries(Users $user, string $siteId, string $typeId): array
    {
        return $this->entries->findBy(['customType' => $this->getType($user, $siteId, $typeId)]);
    }

    public function saveEntry(Users $user, string $siteId, string $typeId, SaveCustomEntryDTO $dto, ?string $entryId = null): CustomEntry
    {
        $type = $this->getType($user, $siteId, $typeId);
        $allowed = array_column($type->getFields(), 'key');
        foreach ($dto->values as $key => $value) {
            if (!in_array($key, $allowed, true) || (!is_scalar($value) && $value !== null)) {
                throw new BadRequestHttpException('Invalid entry values.');
            }
        }
        $entry = $entryId ? $this->entries->findOneBy(['id' => $entryId, 'customType' => $type]) : new CustomEntry();
        if (!$entry instanceof CustomEntry) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('Entry not found.');
        }
        $entry->setCustomType($type)->setValues($dto->values);
        $this->em->persist($entry);
        $this->em->flush();
        return $entry;
    }

    public function deleteEntry(Users $user, string $siteId, string $typeId, string $entryId): void
    {
        $type = $this->getType($user, $siteId, $typeId);
        $entry = $this->entries->findOneBy(['id' => $entryId, 'customType' => $type]);
        if (!$entry instanceof CustomEntry) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('Entry not found.');
        }
        $this->em->remove($entry);
        $this->em->flush();
    }

    public function deleteType(Users $user, string $siteId, string $typeId): void
    {
        $type = $this->getType($user, $siteId, $typeId);
        $this->em->remove($type);
        $this->em->flush();
    }
}
