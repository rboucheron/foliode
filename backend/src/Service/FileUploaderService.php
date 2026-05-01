<?php

namespace App\Service;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\ByteString;

class FileUploaderService
{
    public function __construct(private Filesystem $filesystem)
    {
    }

    public function uploadFileBase64(string $fileContent, string $directory): string
    {
        if (empty($fileContent)) {
            throw new \InvalidArgumentException('Invalid file upload');
        }

        $decodedFile = $this->decodeBase64File($fileContent);
        $extension = $decodedFile->guessExtension() ?? $this->guessExtensionFromMimeType($decodedFile->getMimeType());

        if (!in_array($extension, ['pdf', 'png', 'jpg', 'jpeg'], true)) {
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

    private function decodeBase64File(string $fileContent): File
    {
        if (preg_match('/^data:(.*?);base64,(.*)$/', $fileContent, $matches)) {
            $mimeType = $matches[1];
            $base64Data = $matches[2];
        } else {
            $mimeType = null;
            $base64Data = $fileContent;
        }

        $binaryData = base64_decode($base64Data, true);
        if ($binaryData === false) {
            throw new \InvalidArgumentException('Invalid base64 content');
        }

        $tempFilePath = tempnam(sys_get_temp_dir(), 'upload_');
        if ($tempFilePath === false) {
            throw new \InvalidArgumentException('Unable to create temporary file');
        }

        file_put_contents($tempFilePath, $binaryData);

        return new File($tempFilePath, false);
    }

    private function guessExtensionFromMimeType(?string $mimeType): ?string
    {
        return match ($mimeType) {
            'application/pdf' => 'pdf',
            'image/png' => 'png',
            'image/jpeg' => 'jpg',
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
