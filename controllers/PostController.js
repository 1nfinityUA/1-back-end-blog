import PostModel from "../models/Post.js";

// функція для отримання всіх статей
export const getAll = async (req, res) => {
    try {
        // populate i exec звязує коричтувача щоб було видно хто питає данні
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не вдалось отримати статті",
        });
    }
};

// функція для отримання однієї статті по ід
export const getOne = async (req, res) => {
    try {
        // витягуємо динамічний ід статті
        const postId = req.params.id;
        // шукаємо потрібну статтю і оновляємо її щоб показник переглядів оновився
        // першим параметром що шукаємо, другим що оновлуємо і як
        // третім що хочимо повернути вже оновленну статтю
        // четвертим параметром ми вказуємо саму функцію яка повинна виконатись
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не вдалось отримати статтю",
                    });
                }
                // якщо нічого не створено в док
                if (!doc) {
                    return res.status(404).json({
                        message: "Стаття не знайдена",
                    });
                }
                res.json(doc);
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Не вдалось отримати статтю",
        });
    }
};

// функція для видалення
export const remove = async (req, res) => {
    try {
        // витягуємо динамічний ід статті
        const postId = req.params.id;
        PostModel.findOneAndDelete(
            // привязуємо ід яку потрібно видалити
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не вдалось видалити",
                    });
                }
                if (!doc) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Стаття не знайдена",
                    });
                }
                res.json({
                    message: "Статтю видалено",
                });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Не вдалось видалити",
        });
    }
};

// функця для створення постів
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            // body це те що передає користувач
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            // юзер ми беремо самі з бек-енду
            user: req.userId,
            tags: req.body.tags,
        });
        // створюємо і зберігаємо
        const post = await doc.save();
        // повертаємо відповідь
        res.json(post);
        // помилку ми виводимо для себе в консоль
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не вдалось створити статтю",
        });
    }
};

// функція для оновлення статті
export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        // першим параметром яку саме статтю оновлюємо
        // другим що саме оновлюємо
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                // боді нам передає користувач
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                // ід ми беремо з бекенду
                user: req.userId,
                tags: req.body.tags,
            }
        );
        res.json({
            message: "Статтю оновленно",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не вдалось оновити статтю",
        });
    }
};
