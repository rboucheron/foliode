<?php

namespace App\Service;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\ByteString;

class FileUploaderService
{
    private const MAX_BASE64_FILE_SIZE_BYTES = 5242880;
    private const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

    public function __construct(private Filesystem $filesystem)
    {
    }

    public function uploadFileBase64(string $fileContent, string $directory): string
    {
        if (empty($fileContent)) {
            throw new \InvalidArgumentException('Invalid file upload');
        }

        ['file' => $decodedFile, 'mimeType' => $mimeType] = $this->decodeBase64File($fileContent);
        $extension = $this->guessExtensionFromMimeType($mimeType ?? $decodedFile->getMimeType());

        if (!in_array($mimeType, self::ALLOWED_IMAGE_MIME_TYPES, true) || !in_array($extension, ['png', 'jpg', 'jpeg', 'webp'], true)) {
            @unlink($decodedFile->getPathname());
            throw new \InvalidArgumentException('Unsupported file type');
        }

        $fileName = $this->generateRandomString() . '.' . $extension;

        try {
            $decodedFile->move($directory, $fileName);
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Failed to upload file');
        }

        $relativePath = $this->getRelativePath($directory);

        if ($relativePath === null) {
            return $fileName;
        }

        return $relativePath . '/' . $fileName;
    }

    public function uploadFile(UploadedFile $file, string $directory): string
    {

        if (!$file->isValid()) {
            throw new \InvalidArgumentException(" Invalid file upload ");
        }

        $fileName = $this->generateRandomString() . '.' . $file->guessExtension();

        try {
            $file->move($directory, $fileName);
        } catch (\Exception $e) {
            throw new \InvalidArgumentException(" Failed to upload file  ");
        }

        $relativePath = $this->getRelativePath($directory);

        return $relativePath . '/' . $fileName;
    }

    public function deleteFile(string $filePath): void
    {
        if ($this->filesystem->exists($filePath)) {
            $this->filesystem->remove($filePath);
        }
    }

    private function generateRandomString(): string
    {
        return ByteString::fromRandom(25, 'abcdefghijklmnopqrstuvwxyz0123456789');
    }

    private function decodeBase64File(string $fileContent): array
    {
        if (preg_match('/^data:(.*?);base64,(.*)$/', $fileContent, $matches)) {
            $mimeType = $matches[1];
            $base64Data = $matches[2];
        } else {
            throw new \InvalidArgumentException('Invalid base64 data URI');
        }

        $binaryData = base64_decode($base64Data, true);
        if ($binaryData === false) {
            throw new \InvalidArgumentException('Invalid base64 content');
        }

        if (strlen($binaryData) > self::MAX_BASE64_FILE_SIZE_BYTES) {
            throw new \InvalidArgumentException('File exceeds max allowed size');
        }

        $tempFilePath = tempnam(sys_get_temp_dir(), 'upload_');
        if ($tempFilePath === false) {
            throw new \InvalidArgumentException('Unable to create temporary file');
        }

        file_put_contents($tempFilePath, $binaryData);

        return ['file' => new File($tempFilePath, false), 'mimeType' => $mimeType];
    }

    private function guessExtensionFromMimeType(?string $mimeType): ?string
    {
        return match ($mimeType) {
            'application/pdf' => 'pdf',
            'image/png' => 'png',
            'image/jpeg' => 'jpg',
            'image/webp' => 'webp',
            default => null,
        };
    }

    private function getRelativePath(string $path): ?string
    {
        $keyword = 'uploads';
        $position = strpos($path, $keyword);
        if ($position !== false) {
            return substr($path, $position);
        }
        return null;
    }
}
