export default class ValidaServerest {
    //classe com as validações das ações

    static validarBuscaUsuario(resposta){
        //expect(resposta.status).to.eq(200);
        //expect(resposta).to.be.a('object');
        //expect(resposta.body.quantidade).to.be.a('number');
        expect(resposta.body.quantidade).to.be.greaterThan(0)
    }

    static validarBuscaUsuarioId(resposta){
        expect(resposta.status).to.eq(200);
        //expect(resposta).to.be.a('object');
        //expect(resposta.body.nome).to.be.a('string');
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
        //expect(resposta.body.message).to.be.a('string');
        expect(resposta.body.message).to.be.equal('Cadastro realizado com sucesso')
    }

    static validaBuscaProdutoPorIdSemSucesso(resposta){
        expect(resposta.status).to.be.eq(400);
        expect(resposta.body.message).to.be.equal('Produto não encontrado');
    }

    static validaCadatrarProdRepetido(resposta){
        expect(resposta.status).to.be.eq(400);
        expect(resposta.body.message).to.be.equal('Já existe produto com esse nome');
    }

    static validaCadastrarProdutoSemToken(resposta){
        expect(resposta.status).to.be.eq(401);
        expect(resposta.body.message).to.be.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    }

    static validaExcluirProduto(resposta){
        expect(resposta.status).to.be.eq(200);
        expect(resposta.body.message).to.be.equal('Registro excluído com sucesso');
        cy.log(resposta.body.message)
    }

    static validaExcluirProdutoSemToken(resposta){
        expect(resposta.status).to.be.eq(401);
        expect(resposta.body.message).to.be.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        cy.log(resposta.body.message)
    }

    static validaAlterarProdutoComSucesso(resposta){
        expect(resposta.status).to.be.eq(200);
        expect(resposta.body.message).to.be.equal('Registro alterado com sucesso');
        cy.log(resposta.body.message)
    }

    static validaCadastroComPut(resposta){
        expect(resposta.status).to.be.eq(201);
        expect(resposta.body.message).to.be.equal('Cadastro realizado com sucesso');
        cy.log(resposta.body.message)
    }

    static validaProdutoDuplicado(resposta){
        expect(resposta.status).to.be.eq(400);
        expect(resposta.body.message).to.be.equal('Já existe produto com esse nome');
        cy.log(resposta.body.message)
    }

    static validaBuscarCarrinhos(resposta){
        expect(resposta.status).to.be.eq(200);
        expect(resposta.body.quantidade).to.be.greaterThan(0);
    }

    static validaBuscarCarrinhoPorId(resposta){
        expect(resposta.status).to.be.eq(200);
    }

    static validaFalharBuscarCarrinhoPorId(resposta){
        expect(resposta.status).to.be.eq(400);
        expect(resposta.body.message).to.be.eq('Carrinho não encontrado')
    }

    static validaCadastrarCarrinho(resposta){
        cy.log(resposta.body.message);
        expect(resposta.status).to.be.eq(201);
        expect(resposta.body.message).to.be.eq('Cadastro realizado com sucesso');
        
    }

    static validaConcluirCompra(resposta){
        expect(resposta.status).to.be.equal(200);
        expect(resposta.body.message).to.be.eq('Registro excluído com sucesso');
    }

    static validaCancelarCompra(resposta){
        expect(resposta.status).to.be.equal(200);
        expect(resposta.body.message).to.be.eq('Registro excluído com sucesso. Estoque dos produtos reabastecido');
    }
}