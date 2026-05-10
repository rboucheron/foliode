<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\HttpException;

class InternalServerExceptionService
{
    public function create(string $message = 'Internal server error', ?\Throwable $previous = null): HttpException
    {
        return new HttpException(500, $message, $previous);
    }

    public function raise(string $message = 'Internal server error', ?\Throwable $previous = null): never
    {
        throw $this->create($message, $previous);
    }
}
