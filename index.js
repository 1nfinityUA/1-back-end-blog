import express from "express";
// для загрузки картинок
import multer from "multer";
// для роботи з базою данних
import mongoose from "mongoose";
// імпортуємо нашу перевірку з файла
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./auth.js";

// функції винесенно в окремий файл
import { UserController, PostController } from "./controllers/index.js";
// перевірка на валідність з окремого файла
import {checkAuth, hundleValidationErrors} from "./Utils/index.js";

// підключаємось до бази данних за логіном і паролем
mongoose
    .connect(
        "mongodb+srv://admin:wwwwww@cluster1.1biylr6.mongodb.net/blog?retryWrites=true&w=majority"
    )
    // якщо з базою все добре бачиом в консолі або ОК або помилку
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));

// переміщуємо всі властивості експресу в змінну апп
const app = express();

// експрес не знає що таке json, тому ми йому маємо це пояснити
app.use(express.json());
// для того щоб картинка відкривалась по УРЛ
app.use("/uploads", express.static("uploads"));

// створюємо сховище для картинок
const storage = multer.diskStorage({
    // шлях куда зберігаємо файли
    // це заглушки в то що очікує функція
    destination: (_, __, callback) => {
        callback(null, "uploads");
    },
    // як назвемо файл
    filename: (_, file, callback) => {
        // зберігаємо назву файла таку яку дав користувач
        callback(null, file.originalname);
    },
});

// логіку мультера використовуєм для експрес
const upload = multer({ storage });

// створюємо роут для завантаження картинок
app.post("/upload", checkAuth, upload.single("file"), (req, res) => {
    // тут ми повертаємо користувачу відповідь по якому шляху ми зберегли картинку
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// створюємо авторизацію
app.post(
    "/auth/login",
    loginValidation,
    hundleValidationErrors,
    UserController.login
);

// створюємо регістрацію
// коли буде запит пост ми перевіряємо за валідацію і тоді виконуємо інші інструкції
app.post(
    "/auth/register",
    registerValidation,
    hundleValidationErrors,
    UserController.register
);

//створюємо запит про інформацію за себе
//2 параметр це функція перевірки
app.get("/auth/me", checkAuth, UserController.getMe);
// робота з статтями
// тільки авторизований користувач може (видаляти, редагувати, створювати)
app.get("/posts", PostController.getAll);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    hundleValidationErrors,
    PostController.create
);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    hundleValidationErrors,
    PostController.update
);

// створюємо сервер за портом 4444
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
