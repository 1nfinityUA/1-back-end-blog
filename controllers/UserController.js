// для шифровки паролів
import bcrypt from "bcrypt";
// для шифровки запитів по ключу в клієнт серверних взаємодіях
import jwt from "jsonwebtoken";
// імпортуємо юзера для його створення за нашою формою
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        // треба зашифрувати пароль перед тим як його передавати
        const password = req.body.password;
        // це алгоритм шифрування пароля
        const salt = await bcrypt.genSalt(10);
        // передаємо сам пароль та алгоритм за допомогою якого ми шифруємо пароль
        const hash = await bcrypt.hash(password, salt);

        // створюємо документ юзера описавши який має вигляд
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        // а тепер зберігаємо
        const user = await doc.save();

        // створюємо токен для шифровки ІД (що шифруємо, код шифровки, скільки валідний код шифровки)
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secred123",
            {
                expiresIn: "30d",
            }
        );

        // видаляємо з відповіді в рес пароль щоб не повертало його
        const { passwordHash, ...userData } = user._doc;

        // повертаємо відповідь що лежить в юзері + токен
        res.json({
            ...userData,
            token,
        });
        // ловимо помилки та собі в консоль виводимо що за помилка
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось за рееструватись",
        });
    }
};

export const login = async (req, res) => {
    try {
        // перевіряємо чи є в базі користувач з таким імейлом
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                // таке можна виводити тільки для свого пет проекту
                // для комерційних проектів виводимо (невірний логін чи пароль)
                message: "Користувача не знайдено",
            });
        }
        // перевіряємо чи сходиться пароль з им що є у базі данних і зтим що прийшов з запиту
        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            return res.status(400).json({
                // але ми знаємо що не вірний саме пароль а виводимо таке смс
                message: "Невірний логін чи пароль",
            });
        }

        // створюємо токен для шифровки ІД (що шифруємо, код шифровки, скільки валідний код шифровки)
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secred123",
            {
                expiresIn: "30d",
            }
        );
        // видаляємо з відповіді в рес пароль щоб не повертало його
        const { passwordHash, ...userData } = user._doc;

        // повертаємо відповідь що лежить в юзері + токен
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалось за авторизуватись",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        // шукає користувача по ід
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Такого користувача не знайдено",
            });
        }
        // видаляємо з відповіді в рес пароль щоб не повертало його
        const { passwordHash, ...userData } = user._doc;

        // повертаємо відповідь що лежить в юзері
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Користувача не знайдено",
        });
    }
};
