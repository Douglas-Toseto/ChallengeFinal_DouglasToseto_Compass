/*
Tentativa de um fluxo de testes prioritários na API, simulando uma situação de caso de uso real.
Endpoints a serem testados:


1. Cadastro de novo usuário e login
    [POST /usuario]
    [POST /login]
2. Cadastro de novo produto
    [POST /produtos]
3. Alteração dos dados do produto
    [PUT /produtos/{_id}]
4. Adicionar um produto ao carrinho
    [GET /produtos]
    [POST /carrinhos]
5. Cancelar compra
    [DELETE /carrinhos/cancelar-compra]
6. Exclusão do produto
    [DELETE /produtos/{_id}]
7. Excluir o usuário criado
    [DELETE /usuarios/{_id}]
*/

/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 
import { faker } from '@faker-js/faker'
import Factory from '../fixtures/factory'


describe('Fluxo de testes prioritários', () => {
    beforeEach('Pesquisar o último produto e atualizar o Json', ()=>{                 
        Serverest.buscarProdutos().then(res => {
            cy.contractValidation(res, 'get_produtos', 200);
            //ValidaServerest.validarBuscaProdutos(res);
            expect(res.status).to.be.eq(200);
            expect(res.body.quantidade).to.be.greaterThan(0);
            cy.writeFile('cypress/fixtures/produto.json', res.body.produtos[res.body.produtos.length-1])
        })
    })

    it('Deve realizar cadastro de novo usuário e realizar seu login', ()=>{       
        let usuario = Factory.gerarUsuario();
        Serverest.cadastraUsuario(usuario).then(res => {
            cy.contractValidation(res, 'post_usuarios', 201);
            expect(res.status).to.be.equal(201);
            Cypress.env('idUsuarioAtual', res.body._id)   //usando uma variável de ambiente para armazenar o id do usuário atual (assim como o Bearer)
        })
        let usuarioLogin = {
            "email": usuario.email,
            "password": usuario.password
        }
        Serverest.logar(usuarioLogin).then( res => {
            ValidaServerest.validarLoginComSucesso(res);
            Serverest.salvarToken(res);   
        })
    })

    it('Deve cadastrar um produto com sucesso', () => {
        Serverest.cadastrarProdutoComSucesso().then(res => {           
            cy.contractValidation(res, 'post_produtos', 201);
            ValidaServerest.validaCadastrarProdutoComSucesso(res);
        })
    })

    it('Deve alterar as informações de um produto existente', () => {
        cy.fixture('produto.json').then(arquivo => {
            let produto = Factory.gerarProduto() //gera novas informações aleatórias
            let idProduto = arquivo._id;        // ID do produto existente
            Serverest.alterarProduto(idProduto, produto).then(res => {
                cy.contractValidation(res, 'put_produtos', 200);
                ValidaServerest.validaAlterarProdutoComSucesso(res);
                produto._id = idProduto; //adiciona o ID ao objeto JSON (o factory cria sem um id)
                cy.writeFile('cypress/fixtures/produto.json', produto); //atualiza o ultimo produto salvo no Json
            })
        })
    })

    it('Deve salvar o último produto e adicionar ao carrinho', () => {
        cy.fixture('produto.json').then(arquivo => {
            let produtosCarrinho = {                        
                "produtos": [
                    {
                        "idProduto": arquivo._id,
                        "quantidade": 1
                    }
                ]
            };
            Serverest.cadastrarCarrinho(produtosCarrinho).then(res => {  
                cy.contractValidation(res, 'post_carrinhos', 201);
                ValidaServerest.validaCadastrarCarrinho(res);           
            })                                                          
        })
    })

    it('Deve cancelar uma compra e excluir o carrinho', () => {
        Serverest.cancelarCompra().then(res => {
            cy.contractValidation(res, 'delete_carrinhos', 200);
            ValidaServerest.validaCancelarCompra(res);
        })
    })

    it('Deve deletar um produto com ID específico', ()=>{
        cy.fixture('produto.json').then(arquivo =>{ //vamos excluir último produto salvo no JSON
            let idProduto = arquivo._id;
            Serverest.excluirProduto(idProduto).then(res=>{
                cy.contractValidation(res, 'delete_produtos', 200);
                ValidaServerest.validaExcluirProduto(res);
            })
        })
    })

    it('Deve excluir o usuario cadastrado', () => {
        let idUsuarioAtual = Cypress.env('idUsuarioAtual');
        Serverest.excluirUsuario(idUsuarioAtual).then(res =>{
            cy.contractValidation(res, 'delete_usuarios', 200);
            expect(res.status).to.be.eq(200);
            expect(res.body.message).to.be.eq('Registro excluído com sucesso');
            cy.log(res.body.message)  
        })
    })


})