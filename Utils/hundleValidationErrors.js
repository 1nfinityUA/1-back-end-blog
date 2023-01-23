// буде перевыряти чи є помилки при  реэстрації
import { validationResult } from "express-validator";

export default (req, res, next) => {
    const errors = validationResult(req);
        // тут ми дивимось чи помилки не пусті і якщо там шось є тоді робимо іф
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        next();
}