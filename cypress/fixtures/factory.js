import { faker } from '@faker-js/faker';

export default class Factory {

    static gerarProduto(){
        return {
            "nome": faker.commerce.productName(),
            "preco": faker.commerce.price(),
            "descricao": faker.commerce.productDescription(),
            "quantidade": faker.datatype.number()
        }
    }

    static gerarUsuario(){
        return {
            "nome": faker.name.fullName(),
            "email": faker.internet.email(),
            "password": faker.internet.password(),
            "administrador": "true"
        }
    }
}