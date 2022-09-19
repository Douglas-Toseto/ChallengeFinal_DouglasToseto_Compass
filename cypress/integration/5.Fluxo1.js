/*
Tentativa de um fluxo de testes prioritários na API, simulando uma situação de caso de uso real.
Endpoints a serem testados:

1. Login de usuário existente
    [POST /login]
2. Adicionar produto existente a um carrinho
    [GET /produtos]
    [POST /carrinhos]
3. Concluir compra
    [DELETE /carrinhos/concluir-compra]
*/

/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 


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

    
    it('Deve realizar login com sucesso', ()=>{
        Serverest.buscarUsuarioParaLogin();
        cy.get('@usuarioLogin').then(usuario => {    
            Serverest.logar(usuario).then( res => {
                ValidaServerest.validarLoginComSucesso(res);
                Serverest.salvarToken(res);
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

    it('Deve concluir uma compra e excluir o carrinho', () => {
        cy.fixture('produto.json').then(arquivo => {
            let qtdAnterior = arquivo.quantidade;
            let idProduto = arquivo._id
            Serverest.concluirCompra().then(res => {
                cy.contractValidation(res, 'delete_carrinhos', 200);
                ValidaServerest.validaConcluirCompra(res);
                
                //validação da diminuição correta da quantidade de produtos 
                Serverest.buscarProdutoPorId(idProduto).then(produto => {
                    expect(produto.body.quantidade).to.be.eq(qtdAnterior - 1);      //colocar a quantidade de produtos que estão no carrinho numa variável global
                })
            })
        })
    })
})