import mongoose from "mongoose";

// створюємо схему для посту
const PostSchema = new mongoose.Schema({
    // заголовок
    title: {
        type: String,
        // обовязкове поле при створенні посту
        require: true,
    },
    // текст
    text: {
        type: String,
        // обовязкове поле при створенні посту
        require: true,
        // text має бути унікальним для кожного посту
        unique: true,
    },
    // автор статті
    user: {
        // це спецыальний тип який дає база данних (ід)
        type: mongoose.Schema.Types.ObjectId,
        // щоб ссилатись на окремого користувача і його імя
        ref: 'User',
        // обовязкове поле при створенні посту
        require: true,
    },
    // теги маюит прийти масивом
    tags: {
        type: Array,
        // за дефолтом це пустий масив якщо нічого не прийде при створенні
        delault: []
    },
    // скільки було переглядів 
    viewsCount: {
        type: Number,
        default: 0,
    },
    // картинка не обовязкова
    imageUrl: String,
}, {
    timestamps: true,
});
// експортуємо схему (називаємо як пост вказуємо що за схему імпортуємо)
export default mongoose.model('Post', PostSchema)