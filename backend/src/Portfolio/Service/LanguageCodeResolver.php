<?php

namespace App\Portfolio\Service;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\String\Slugger\AsciiSlugger;

class LanguageCodeResolver
{
    public const SITE_CODE_PATTERN = '/^[a-z]{2,3}$/';
    public const FREE_CODE_PATTERN = '/^x-[a-z0-9]+(?:-[a-z0-9]+)*$/';
    public const FREE_CODE_PREFIX = 'x-';
    public const MAX_SLUG_LENGTH = 40;
    public const MAX_CODE_LENGTH = 64;
    public const MAX_LABEL_LENGTH = 100;

    public function resolve(mixed $code, mixed $label): array
    {
        if ($code !== null && !is_string($code)) {
            throw new BadRequestHttpException('Language code must be a string.');
        }
        if ($label !== null && !is_string($label)) {
            throw new BadRequestHttpException('Language label must be a string.');
        }

        $code = $code === null ? null : trim($code);
        $code = $code === '' ? null : $code;
        $label = $label === null ? null : trim($label);
        $label = $label === '' ? null : $label;

        if ($code !== null && preg_match(self::SITE_CODE_PATTERN, $code) === 1) {
            return ['code' => $code, 'label' => null];
        }

        if ($label === null) {
            throw new BadRequestHttpException(sprintf('Invalid language "%s": a site language code or a label is required.', $code ?? ''));
        }

        if (mb_strlen($label) > self::MAX_LABEL_LENGTH) {
            throw new BadRequestHttpException(sprintf('Language label cannot exceed %d characters.', self::MAX_LABEL_LENGTH));
        }

        if ($code !== null) {
            if (strlen($code) > self::MAX_CODE_LENGTH || preg_match(self::FREE_CODE_PATTERN, $code) !== 1) {
                throw new BadRequestHttpException(sprintf('Invalid language code "%s".', $code));
            }

            return ['code' => $code, 'label' => $label];
        }

        return ['code' => $this->generateFreeCode($label), 'label' => $label];
    }

    public function generateFreeCode(string $label): string
    {
        $slug = strtolower((string) (new AsciiSlugger())->slug($label));
        $slug = trim(substr($slug, 0, self::MAX_SLUG_LENGTH), '-');

        if ($slug === '') {
            $slug = substr(sha1(mb_strtolower(trim($label))), 0, 8);
        }

        return self::FREE_CODE_PREFIX . $slug;
    }
}
