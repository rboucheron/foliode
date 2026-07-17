<?php

namespace App\Admin\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class LoginFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'label' => 'Email',
                'attr' => [
                    'autocomplete' => 'off',
                ],
            ])
            ->add('password', PasswordType::class, [
                'label' => 'Mot de passe',
                'attr' => [
                    'autocomplete' => 'current-password',
                ],
            ])
            ->add('securityCode', PasswordType::class, [
                'label' => 'Code de sécurité',
                'attr' => [
                    'autocomplete' => 'off',
                ],
            ])
            ->add('login', SubmitType::class, [
                'label' => 'Se connecter',
            ]);
    }
}
