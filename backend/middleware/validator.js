const { check, validationResult } = require('express-validator');
const {StatusCodes} = require('http-status-codes');

exports.errorValidate = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message : "입력 값을 다시 확인해주세요. "});
    }
    return next(); 
}

exports.validateEitherOne = (fields) => [
    check(fields).custom((value, {req}) => {
        const eitherOne = fields.some(field => req.body?.[field] || req.query?.[field] || req.params?.[field]); 
        if (!eitherOne) {
            throw new Error(`One of ${fields.join(' or ')} required`);
        }
        return true;
    })
]