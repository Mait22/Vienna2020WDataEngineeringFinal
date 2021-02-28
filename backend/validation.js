// Validation
const Joi = require('joi');

//Register validation
const registerValidation = (data) => {
    const valSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().min(1).required()
    })
    return valSchema.validate(data)
}

const loginValidation = (data) => {
    const valSchema2 = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return valSchema2.validate(data)
}

// Add company validation
const addCompanyValidation = (data) => {
    const valSchema2 = Joi.object({
        companyName: Joi.string().min(1).required(),
        employeeCount: Joi.number().integer(),
        turnoverEur: Joi.number().integer(),
        email: Joi.string().min(6).required().email(),
        phoneNo: Joi.string().min(6).required(),
        activityAreas: Joi.array().items(Joi.string()),
        exportMarkets: Joi.array().items(Joi.string()),
        dd: Joi.number().integer().optional(),
        mm: Joi.number().integer().optional(),
        yyyy: Joi.number().integer().optional(),
        eventName: Joi.string().optional()
    })
    return valSchema2.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.addCompanyValidation = addCompanyValidation

