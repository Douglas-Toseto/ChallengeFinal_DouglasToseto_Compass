import Factory from '../fixtures/factory';

const URL_USUARIOS  = '/usuarios';
const URL_LOGIN     = '/login';
const URL_PRODUTOS  = '/produtos';
const URL_CARRINHOS = '/carrinhos';

//classe que define as ações relacionadas a API

export default class Serverest {
    
    // Ações relacionadas a /usuários //

    //buscar todos os usuários
    static buscarUsuarios (){
        return cy.rest('GET', URL_USUARIOS)
    }

    //busca usuário específico
    static buscarUsuario (id){
        return cy.rest('GET', URL_USUARIOS+'/'+id)
    }

    //busca as informações do 1º usuário para realizar login
    static buscarUsuarioParaLogin(){
        cy.request(URL_USUARIOS).then(res=>{
            cy.wrap({                           //cy.wrap empacota informações que podem ser acessadas com cy.get e pelo seu alias
                "email": res.body.usuarios[0].email,
                "password": res.body.usuarios[0].password
            }).as('usuarioLogin')               //alias do pacote
        })
    }

    //realiza login
    static logar(usuario){
        return cy.rest('POST', URL_LOGIN, usuario)
    }

    //salva o beareToken do usuário
    static salvarToken(resposta){
        Cypress.env('bearer', resposta.body.authorization.slice(7))  //Cypress.env permite acessar as configurações de ambiente ( em dev.jon)
        cy.log(Cypress.env('bearer'))                                //então podemos salvar lá o conteudo de authorization na propriedade bearer
    }




    // Ações relacionadas a /produtos //

    //busca a listagem de produtos
    static buscarProdutos(){
        return cy.rest('GET', URL_PRODUTOS)
    }

    //cadastro de produto
    static cadastrarProdutoComSucesso(){
        let produto = Factory.gerarProduto();   //usa a classe que definimos para gerar um produto aleatório e então realizar seu cadastro
        return cy.request({
            method: 'POST',
            url: URL_PRODUTOS,
            body: produto,
            failOnStatusCode: true,
            auth: {                     //Atenção para o formato da autenticação (não está no header)
                bearer: Cypress.env("bearer")
            }
        })
    }

}