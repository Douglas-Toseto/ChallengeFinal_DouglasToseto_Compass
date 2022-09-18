import { faker } from '@faker-js/faker';
import Factory from '../fixtures/factory';

const URL_USUARIOS  = '/usuarios';
const URL_LOGIN     = '/login';
const URL_PRODUTOS  = '/produtos';
const URL_CARRINHOS = '/carrinhos';

//classe que define as ações relacionadas a API

export default class Serverest {
    
    //--------------------- Ações relacionadas a /usuários -----------------------------

    //buscar todos os usuários
    static buscarUsuarios (){
        return cy.rest('GET', URL_USUARIOS)
    }

    //busca usuário específico
    static buscarUsuarioPorId (id){
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

    //cadastra usuário
    static cadastraUsuario(usuario){
        return cy.rest('POST', URL_USUARIOS, usuario);
    }

    //altera os dados de um usuário existente. Se o id não existir, cria um novo cadastro.
    static alteraUsuario(id, usuario){
        return cy.rest('PUT', URL_USUARIOS+'/'+id, usuario)
    }

    //excluir usuário pelo id
    static excluirUsuario(id){
        return cy.rest('DELETE', URL_USUARIOS+'/'+id)
    }




    //---------------------------- Ações relacionadas a /produtos -------------------------------------------------------

    //busca a listagem de todos os produtos
    static buscarProdutos(){
        return cy.rest('GET', URL_PRODUTOS)
    }

    //busca um produto por ID específico
    static buscarProdutoPorId(id){
        return cy.rest('GET', URL_PRODUTOS+'/'+id)
    }

    //cadastro de produto novo
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

    //cadastro de produto existente
    static cadastrarProdutoRepetido(){
        cy.fixture('produto.json').then(arquivo =>{
            return cy.request({
                method: 'POST',
                url: URL_PRODUTOS,
                body: {
                    "nome": arquivo.nome,
                    "preco": arquivo.preco,
                    "descricao": arquivo.descricao,
                    "quantidade": arquivo.quantidade
                },
                failOnStatusCode: true,
                auth: {                     
                    bearer: Cypress.env("bearer")
                }
            })
        })
    }

    //cadastro de produto sem token
    static cadastrarProdutoSemToken(){
        let produto = Factory.gerarProduto();   //usa a classe que definimos para gerar um produto aleatório e então realizar seu cadastro
        let token = faker.datatype.number();
        return cy.request({
            method: 'POST',
            url: URL_PRODUTOS,
            body: produto,
            failOnStatusCode: false,
        })
    }

    //excluir produto com ID específico
    static excluirProduto(id){
        return cy.request({
            method: 'DELETE',
            url: URL_PRODUTOS+'/'+id,
            failOnStatusCode: true,
            auth: {                     
                bearer: Cypress.env("bearer")
            }
        })      
    }

    //excluir de produto sem token
    static excluirProdutoSemToken(id){
        return cy.request({
            method: 'DELETE',
            url: URL_PRODUTOS+'/'+id,
            failOnStatusCode: false,
        })
    }






}