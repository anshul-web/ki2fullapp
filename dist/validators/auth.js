const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [check('firstName').notEmpty().withMessage('firstName is Required'), check('lastName').notEmpty().withMessage('lastName is Required'), check('email').isEmail().withMessage('Valid Email is Required'), check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 character long')];

exports.validateSigninRequest = [check('email').isEmail().withMessage('Valid Email is Required'), check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 character long')];

exports.isRequestValidate = (req, res, next) => {
    const error = validationResult(req);
    if (error.array().length > 0) {
        return res.status(400).json({ error: error.array()[0].msg });
    }
    next();
};