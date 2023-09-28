import * as Joi from "joi"

export const validateJoi = (object: any, schema: Joi.ObjectSchema) => {
    const { error } = schema.validate(object)
    if (error) throw new Error(error.details[0].message)
}