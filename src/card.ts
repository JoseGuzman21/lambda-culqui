import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from "luhn";
import { CardBuilder, CardEntity } from './entities/cardEntity';
import { validateJoi } from './helper/validatorHelper';
import { CARD_INSERT } from './schemas/schemas';
import { client } from './db/postgresql/config';
import { clientRedis } from './db/redis/config';
require('dotenv').config();

export const saveCard: APIGatewayProxyHandler = async (event: any) => {
    try {
        validateJoi({ ...JSON.parse(event.body), authorization: event.headers.authorization }, CARD_INSERT)

        const { email, card_number, cvv, expiration_year, expiration_month } = JSON.parse(event.body);

        const authorization = event.headers.authorization.split('Bearer ')[1]
        const cardEntity: CardEntity = new CardBuilder().addEmail(email).addCardNumber(card_number).addCvv(cvv)
        .addExpirationYear(expiration_year).addExpirationMonth(expiration_month).addComercio(authorization)

        middleware(cardEntity)
        const token = generateToken()
        await Promise.all([ clientRedis.connect(), client.connect() ])
        await Promise.all([insertCardToDbPostgresql(cardEntity), insertCardtoDbRedis(token, cardEntity)])
        await Promise.all([ clientRedis.quit(), client.end()])

        return { statusCode: 200, body: JSON.stringify({ token }, null, 2) }
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ message: `${e.message}`}, null, 2) }
    }
}

export const insertCardtoDbRedis = async (token: string, cardEntity: CardEntity ) => {
    try {
        const { cvv, ...data } = cardEntity
        await clientRedis.set(token, JSON.stringify({ ...data }), {
            EX: 60 * 15, NX: true
        });
        return true
    } catch (e) {
        throw new Error(`Failed to insert card in database redis: ${e.message}`)
    }
}

export const getCardByToken: APIGatewayProxyHandler = async (event: any) => {
    const { token } = event.pathParameters
    const value = await getCardByTokenInRedis(token)
    return { statusCode: 200, body: JSON.stringify({ data: JSON.parse(value) }) }
}

export const getCardByTokenInRedis = async (token: string) => {
    await clientRedis.connect();
    const value = await clientRedis.get(token);
    await clientRedis.quit()
    if (!value) throw new Error('Tarjeta no encontrada')
    return value
}

export const insertCardToDbPostgresql = async (cardEntity: CardEntity) => {
    try {
        // await client.connect()
        const text = 'INSERT INTO card_number(email, card_number, cvv, expiration_year, expiration_month, comercio) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
        const values = [cardEntity.email, cardEntity.card_number, cardEntity.cvv, cardEntity.expiration_year, cardEntity.expiration_month, cardEntity.comercio]
        await client.query(text, values)
        return true
    } catch (e) {
        throw new Error(`Failed to insert card in database postgresql: ${e.message}`)
    }
}

export const middleware = (cardEntity: CardEntity) => {
    validatePk(cardEntity.comercio)
    validateCardNumber(cardEntity.card_number)
    validateExpirationDate(+cardEntity.expiration_year)
    validateExpirationMonth(+cardEntity.expiration_month)
}

export const validatePk = (pk: string) => {
    const sentence = 'pk_test'
    if (!pk.includes(sentence)) throw new Error('Token not valid')
    return true
}

export const validateCardNumber = (card_number: string) => {
    if(!validate(card_number)) throw new Error('Card number not valid')
    return true
}

export const validateExpirationDate = (expiration_year: number) => {
    const currentYear = new Date().getFullYear()
    const currentYearMoreFiveYears = new Date().getFullYear() + 5
    if (!(expiration_year >= currentYear && expiration_year <= currentYearMoreFiveYears)) throw new Error('Expiration date not valid')
    return true
}

export const validateExpirationMonth = (expiration_month: number) => {
    const currentMonth = new Date().getMonth() + 1
    const monthMax = 12
    if (!(expiration_month >= currentMonth && expiration_month <= monthMax)) throw new Error('Expiration month not valid')
    return true
}

export const generateToken = (): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 16) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}