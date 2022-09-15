/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 

describe('Casos de teste relacionados a rota /produtos da API Serverest', ()=>{
    it('Deve retornar todos os produtos cadastrados', ()=>{
        Serverest.buscarProdutos().then(res => {
            ValidaServerest.validarBuscaProdutos(res);
        })
    })

    
    context('Logar com sucesso', () =>{         //Contexto para organizar os casos de teste
        beforeEach('Logar', ()=>{               //antes de cada caso (it) dentro desse contexto, é realizado o login 
            Serverest.buscarUsuarioParaLogin();
            cy.get('@usuarioLogin').then(usuario => {    //cy.get('@alias') para acessar um objeto wrap
                Serverest.logar(usuario).then( res => {
                    ValidaServerest.validarLoginComSucesso(res);
                    Serverest.salvarToken(res);
                })
            })
        })
        
        it('Deve cadastrar um produto com sucesso', ()=>{
            Serverest.cadastrarProdutoComSucesso().then(res => {
                ValidaServerest.validaCadastrarProdutoComSucesso(res);
            })
        })

    })
    
})