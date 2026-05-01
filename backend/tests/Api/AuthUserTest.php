<?php
namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthUserTest extends WebTestCase
{
    private static string $email;
    private static string $firstName;
    private static string $lastName;
    private static string $token;
    private static string $password = 'PAssword34434??';

    public static function setUpBeforeClass(): void
    {
        $randomId = bin2hex(random_bytes(4));
        self::$email     = 'test+' . $randomId . '@gmail.com';
        self::$firstName = 'Test User Alpha';
        self::$lastName  = 'Test Lastname Beta';
    }

    public function testCreateUser(): string
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/v1/api/user/signup',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'firstName' => self::$firstName,
                'lastName'  => self::$lastName,
                'email'     => self::$email,
                'password'  => self::$password,
            ])
        );

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);

        self::$token = $data['token'];

        return $data['token'];
    }
}
