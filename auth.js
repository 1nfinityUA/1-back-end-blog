import { body } from 'express-validator';

// перевірка для авторизації
export const loginValidation =[
    body('email', 'Невірний формат пошти').isEmail(),
    body('password', "Пароль має бути більще чим 5 символів").isLength({min: 5}),
];

// перевірка для реєстрації
export const registerValidation =[
    body('email', 'Невірний формат пошти').isEmail(),
    body('password', "Пароль має бути більще чим 5 символів").isLength({min: 5}),
    body('fullName', "Вкажіть імя").isLength({min: 3}),
    body('avatarUrl', "Невірна ссилка").optional().isURL(),
];

// перевірка для створення посту
export const postCreateValidation =[
    body('title', 'Заголовок').isLength({min: 3}).isString(),
    body('text', "Текст статті").isLength({min: 10}).isString(),
    body('tags', "Невірний формат тегів").optional().isString(),
    body('imageUrl', "Невірна ссилка").optional().isString(),
];