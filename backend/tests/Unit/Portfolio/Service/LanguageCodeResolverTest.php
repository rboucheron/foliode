<?php

declare(strict_types=1);

namespace App\Tests\Unit\Portfolio\Service;

use App\Portfolio\Service\LanguageCodeResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class LanguageCodeResolverTest extends TestCase
{
    private LanguageCodeResolver $resolver;

    protected function setUp(): void
    {
        $this->resolver = new LanguageCodeResolver();
    }

    public function testSiteLanguageKeepsCodeAndDropsLabel(): void
    {
        self::assertSame(['code' => 'en', 'label' => null], $this->resolver->resolve('en', 'English'));
        self::assertSame(['code' => 'fr', 'label' => null], $this->resolver->resolve(' fr ', null));
    }

    public function testFreeLanguageCodeIsGeneratedFromLabel(): void
    {
        self::assertSame(['code' => 'x-italiano', 'label' => 'Italiano'], $this->resolver->resolve(null, '  Italiano '));
        self::assertSame(['code' => 'x-italiano', 'label' => 'Italiano'], $this->resolver->resolve('', 'Italiano'));
    }

    public function testAccentsAndPunctuationAreSlugified(): void
    {
        self::assertSame('x-portugues-brasil', $this->resolver->generateFreeCode('Português (Brasil)'));
        self::assertSame('x-francais', $this->resolver->generateFreeCode('  Français  '));
    }

    public function testSlugIsTruncatedWithoutTrailingDash(): void
    {
        $code = $this->resolver->generateFreeCode(str_repeat('Langue tres longue ', 5));

        self::assertLessThanOrEqual(LanguageCodeResolver::MAX_SLUG_LENGTH + 2, strlen($code));
        self::assertStringEndsNotWith('-', $code);
        self::assertMatchesRegularExpression(LanguageCodeResolver::FREE_CODE_PATTERN, $code);
    }

    public function testLabelWithoutTransliterableCharactersFallsBackToHash(): void
    {
        $code = $this->resolver->generateFreeCode('😀😀');

        self::assertSame('x-' . substr(sha1('😀😀'), 0, 8), $code);
        self::assertSame($code, $this->resolver->generateFreeCode(' 😀😀 '));
    }

    public function testExistingFreeCodeIsKept(): void
    {
        self::assertSame(['code' => 'x-deutsch', 'label' => 'Deutsch (CH)'], $this->resolver->resolve('x-deutsch', 'Deutsch (CH)'));
    }

    public function testFreeCodeWithoutLabelIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->resolver->resolve('x-deutsch', null);
    }

    public function testMissingCodeAndLabelIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->resolver->resolve(null, '   ');
    }

    public function testInvalidCodeIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->resolver->resolve('EN_us', 'English');
    }

    public function testTooLongLabelIsRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->resolver->resolve(null, str_repeat('a', LanguageCodeResolver::MAX_LABEL_LENGTH + 1));
    }

    public function testNonStringValuesAreRejected(): void
    {
        $this->expectException(BadRequestHttpException::class);

        $this->resolver->resolve(['en'], null);
    }
}
