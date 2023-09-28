import { validateCardNumber, validateExpirationDate, validateExpirationMonth, validatePk, generateToken } from "../src/card";

describe('Test all methods of validate cards', () => {
    test('validatePk authorization', () => {
        const expected = 'pk_test'
        const isMatch = validatePk(expected)
        expect(isMatch).toBe(true)
    })

    test('validateCardNumber', () => {
        const expected = '4111111111111111'
        const isMatch = validateCardNumber(expected)
        expect(isMatch).toBe(true)
    })

    test('validateExpirationDate', () => {
        const expected = 2023
        const isMatch = validateExpirationDate(expected)
        expect(isMatch).toBe(true)
    })

    test('validateExpirationMonth', () => {
        const expected = 10
        const isMatch = validateExpirationMonth(expected)
        expect(isMatch).toBe(true)
    })

    test('generateToken', () => {
        const length = 16
        const token = generateToken()
        expect(token.length).toEqual(length)
    })
})