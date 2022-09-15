export default class ValidaServerest {
    //classe com as validações das ações

    static validarBuscaUsuario(resposta){
        expect(resposta.status).to.eq(200);
        expect(resposta).to.be.a('object');
        expect(resposta.body.quantidade).to.be.a('number');
        expect(resposta.body.quantidade).to.be.greaterThan(0)
    }

    static validarBuscaUsuarioId(resposta){
        expect(resposta.status).to.eq(200);
        expect(resposta).to.be.a('object');
        expect(resposta.body.nome).to.be.a('string');
        cy.log(resposta.body.nome)
    }

    static validarLoginComSucesso(resposta){
        expect(resposta).to.be.a('object');
        expect(resposta.body.message).to.be.a('string');
        expect(resposta.body.message).to.equal('Login realizado com sucesso');
        expect(resposta.body).to.haveOwnProperty('authorization');
    }

    static validarBuscaProdutos(resposta){
        expect(resposta).to.be.a('object');
        expect(resposta.status).to.eq(200);
        expect(resposta.body.quantidade).to.be.a('number');
        expect(resposta.body.quantidade).to.be.greaterThan(0)
    }

    static validaCadastrarProdutoComSucesso(resposta){
        expect(resposta.status).to.eq(201);
        expect(resposta.body.message).to.be.a('string');
        expect(resposta.body.message).to.be.equal('Cadastro realizado com sucesso')
    }
}