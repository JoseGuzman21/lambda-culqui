export class CardBuilder {
    email: string
    card_number: string
    cvv: string
    expiration_year: string
    expiration_month: string
    comercio: string

    addEmail (email: string): CardBuilder {
        this.email = email
        return this
    }

    addCardNumber (card_number: string): CardBuilder {
        this.card_number = card_number
        return this
    }

    addCvv (cvv: string): CardBuilder {
        this.cvv = cvv
        return this
    }

    addExpirationYear (expiration_year: string): CardBuilder {
        this.expiration_year = expiration_year
        return this
    }

    addExpirationMonth (expiration_month: string): CardBuilder {
        this.expiration_month = expiration_month
        return this
    }

    addComercio (comercio: string): CardBuilder {
        this.comercio = comercio
        return this
    }

    build (): CardEntity {
        return new CardEntity(this)
    }
}

export class CardEntity {
    email: string
    card_number: string
    cvv: string
    expiration_year: string
    expiration_month: string
    comercio: string

    constructor (builder: CardBuilder) {
        Object.assign(this, builder)
    }
}