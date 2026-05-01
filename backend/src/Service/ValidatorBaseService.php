<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidatorBaseService
{

    public function __construct(private ValidatorInterface $validator)
    {
    }

    public function CatchInvalidData(object $data): ?array
    {
        $errors = $this->validator->validate($data);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            throw new BadRequestHttpException(json_encode([
                'error' => $errorMessages,
            ], JSON_UNESCAPED_UNICODE));
        }

        return null;
    }
}
