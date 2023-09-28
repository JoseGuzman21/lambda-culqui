import * as Joi from "joi"

export const CARD_INSERT = Joi.object({
    authorization: Joi.string().required(),
    email: Joi.string().required().email().min(5).max(100),
    card_number: Joi.string().required().min(13).max(16),
    cvv: Joi.string().required().min(3).max(4),
    expiration_year: Joi.string().required().min(4).max(4),
    expiration_month: Joi.string().required().min(1).max(2)
})