import mongoose from "mongoose";

// створюємо схему для юзера
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        // обовязкове поле при створенні юзера
        require: true,
    },
    email: {
        type: String,
        // обовязкове поле при створенні юзера
        require: true,
        // пошта має бути унікальною для кожного юзера
        unique: true,
    },
    // хеш - зашифрований пароль
    passwordHash: {
        type: String,
        // обовязкове поле при створенні юзера
        require: true,
    },
    // аватарка не обовязкова
    avatarUrl: String,
}, {
    timestamps: true,
});
// експортуємо схему (називаємо як юзерб вказуємо що за схему імпортуємо)
export default mongoose.model('User', UserSchema)