const { check, validationResult } = require('express-validator');

const validateCreatePlayer = [
    check('name')
        .escape()
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name can not be empty!')
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!'),
    check('position')
        .escape()
        .trim()
        .not()
        .isEmpty()
        .withMessage('position can not be empty!')
        .matches(/^(Goalie|Defence|Forward)$/)
        .withMessage('Välj position mellan Goalie/ Defence / Forward'),
    check('jersey')
        .escape()
        .trim()
        .not()
        .isEmpty()
        .withMessage('jersey can not be empty!')
        .isLength({ min: 1 })
        .withMessage('Minimum 1 characters required!')
        .isInt({ min: 0, max: 99 })
        .withMessage("Bara siffror!"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

module.exports = {
    //validateLoginUser,
    validateCreatePlayer
}