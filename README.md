# Serverless CULQUI

Este lambda cuenta con dos endpoints, uno nos ayuda con el registro de tarjeta y el otro con la busqueda de la tarjeta vía token

## Tecnologías usadas

```json
{
    "backend": "TypeScript",
    "cloud": "AWS",
    "db_relacional": "postgreSql",
    "db_no_relacional": "redis",
    "unit_test": "jest",
    "confi_lambda": "serverless"
}
```

## Pasos para arrancar el Lambda

### Paso 1: Levantar la base de datos redis que se encuentra en docker con el siguiente comando:
```
$ docker compose up -d
```

### Paso 2: Renombrar el archivo .env.test a .env y cambiar los valores de las variables de entorno

### Paso 3: Instalar los paquetes:
```
$ npm i
```

### Paso 4: Levantar el proyecto en local:
```
$ npm run dev
```

### Paso 5: Realizar deploy a AWS:
```
$ npm run deploy
```

### Paso 6 (opcional): Correr las pruebas unitarias:
```
$ npm run jest
```

### Paso 7.1: Probar nuestros endpoints (GET)
```bash
endpoint: GET - https://wq11e9phdc.execute-api.us-east-2.amazonaws.com/card/{token}
```
Response:
```json
{
    "data": {
        "email": "joseguzman@gmail.com",
        "card_number": "4111111111111111",
        "expiration_year": "2023",
        "expiration_month": "09",
        "comercio": "pk_test_LsRBKejzCOEEWOsw"
    }
}
```
### Paso 7.2: Probar nuestros endpoints (POST)
```bash
endpoint: POST - https://wq11e9phdc.execute-api.us-east-2.amazonaws.com/tokens
```
Body:
Authorization: pk_test_LsRBKejzCOEEWOsw
```json
{
    "email": "joseguzman@gmail.com",
    "card_number": "4111111111111111",
    "cvv": "1236",
    "expiration_year": "2023",
    "expiration_month": "09"
}
```
Response:
```json
{
    "token": "yLVjqJMYDYysHqW0"
}
```
## Felicidades, lo hiciste muy bien!!

### Posibles mejoras a futuro

1. Encriptar la información del body (datos de la tarjeta) que viene del cliente (Front) hacía el backend, así mismo guardar toda la informacion encriptada en la base de datos, podría ser utilizando cryptojs o a través de llave pública y privada, así mismo los responses.

2. Uso de Arquitectura Hexagonal en el proyecto.