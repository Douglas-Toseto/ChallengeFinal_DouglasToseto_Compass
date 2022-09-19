/// <reference types="cypress" />

import { validateAdditionalItems } from 'ajv/dist/vocabularies/applicator/additionalItems'
import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 
import { faker } from '@faker-js/faker'
import Factory from '../fixtures/factory'


describe('Casos de teste relacionados a rota /carrinhos da API Serverest', ()=>{

    //---------------------------- GET ---------------------------------------------------------------------------------------------------------------
    it('Deve retornar a lista dos carrinhos ativos', () => {
        Serverest.buscarCarrinhos().then(res => {
            cy.contractValidation(res, 'get_carrinhos', 200);
            ValidaServerest.validaBuscarCarrinhos(res);
            cy.writeFile('cypress/fixtures/carrinho.json', res.body.carrinhos[res.body.carrinhos.length-1]) //salva as informações do último carrinho num json para uso posterior
        })
    })

    it('Deve retornar um carrinho com id específico', () => {
        cy.fixture('carrinho.json').then(arquivo => {
            let idCarrinho = arquivo._id;
            Serverest.buscarCarrinhoPorId(idCarrinho).then(res => {
                cy.contractValidation(res, 'get_carrinho_by_id', 200);
                ValidaServerest.validaBuscarCarrinhoPorId(res); 
            })
        }) 
    })

    it('Deve falhar ao encontrar um carrinho por ID inexistente', () => {
        let idCarrinho = faker.datatype.number();
        Serverest.buscarCarrinhoPorId(idCarrinho).then(res => {
            cy.contractValidation(res, 'get_carrinho_by_id', 400);
            ValidaServerest.validaFalharBuscarCarrinhoPorId(res); 
        })
    })



    //---------------------------------------- POST ----------------------------------------------------------------------------------------------------------
    context('Logar com sucesso', () =>{         //Contexto para organizar os casos de teste
        beforeEach('Logar', ()=>{               //antes de cada caso (it) dentro desse contexto, é realizado o login 
            Serverest.buscarUsuarioParaLogin();
            cy.get('@usuarioLogin').then(usuario => {    //cy.get('@alias') para acessar um objeto wrap
                Serverest.logar(usuario).then( res => {
                    cy.contractValidation(res, 'post_login', 200);
                    //ValidaServerest.validarLoginComSucesso(res);
                    Serverest.salvarToken(res);
                })
            })

        })
        
        it.only('Deve adicionar produto no carrinho com sucesso', () => {
            cy.fixture('produto.json').then(arquivo => {
                let produtosCarrinho = {                        //Declarando como VAR a variável não fica com escopo global??
                    "produtos": [
                        {
                            "idProduto": arquivo._id,
                            "quantidade": 1
                        }
                    ]
                };
                Serverest.cadastrarCarrinho(produtosCarrinho).then(res => {  
                    cy.contractValidation(res, 'post_carrinhos', 201);
                    
                    //o que fazer? Criar um caso de teste para cada status code ou possível resposta? (seriam muitos) <<<<<<<<<<<<<<<<<<
                    // ou apenas validar algumas das respostas esperadas?

                    ValidaServerest.validaCadastrarCarrinho(res);           
                })                                                          
            })
        })

        //---------------------------------- DELETE -----------------------------------------------
        it.only('Deve concluir uma compra e excluir o carrinho', () => {
            cy.fixture('produto.json').then(arquivo => {
                let qtdAnterior = arquivo.quantidade;
                let idProduto = arquivo._id
                Serverest.concluirCompra().then(res => {
                    cy.contractValidation(res, 'delete_carrinhos', 200);
                    ValidaServerest.validaConcluirCompra(res);
                    
                    //validação da diminuição correta da quantidade de produtos [transformar em método dps]
                    Serverest.buscarProdutoPorId(idProduto).then(produto => {
                        expect(produto.body.quantidade).to.be.eq(qtdAnterior - 1);      //colocar a quantidade de produtos que estão no carrinho numa variável global
                    })
                })
            })
            
        })

        it('Deve cancelar uma compra e excluir o carrinho', () => {
            Serverest.cancelarCompra().then(res => {
                cy.contractValidation(res, 'delete_carrinhos', 200);
                ValidaServerest.validaCancelarCompra(res);
            })
        })


    })


    
        
        

})
