import jwt from "jsonwebtoken";

// некст коли перевірку пройшло то код виконується далі
// мається на увазі де вставив перевірку в головному коді
export default (req, res, next) => {
    // повертай в любму випадку строку та видали слово беарер і заміни на пусту строку
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    // якшо передали токен тоді його треба розшифрувати, якщо немає видає смс
    if (token) {
        try {
           const decoded = jwt.verify(token, "secred123");
           req.userId = decoded._id;
           next();
        } catch (error) {
            return res.status(403).json({
                message: "Немає доступу",
            });
        }
    } else {
        return res.status(403).json({
            message: "Немає доступу",
        });
    }
};
