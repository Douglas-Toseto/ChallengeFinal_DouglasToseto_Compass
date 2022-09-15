/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 


describe('Casos de teste relacionados a rota /usuarios da API Serverest', ()=>{
    
    it('Deve realizar login com sucesso', ()=>{
        Serverest.buscarUsuarioParaLogin();
        cy.get('@usuarioLogin').then(usuario => {    //cy.get('@alias') para acessar um objeto wrap
            Serverest.logar(usuario).then( res => {
                ValidaServerest.validarLoginComSucesso(res);
                Serverest.salvarToken(res);
            })
        })
    })
    
})
