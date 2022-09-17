/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 

describe('Casos de teste relacionados a rota /usuarios da API Serverest', () => {
    
    it('Deve retornar todos os usuários cadastrados, fazer validação de contrato e salvar um num json', () => {  //teste para a rota: GET /usuarios
        Serverest.buscarUsuarios().then(res => {
            cy.contractValidation(res, 'get_usuarios', 200);
            //podemos criar outras validações além da validação de contrato
            //ValidaServerest.validarBuscaUsuario(res);
            cy.writeFile('cypress/fixtures/usuario.json', res.body.usuarios[res.body.usuarios.length-1])  //salvando o último usuário cadastrado
        })
    })

    it('Deve buscar um usuário específico por ID', ()=>{     //teste para rota: GET /usuarios/{_id}
        cy.fixture('usuario.json').then(arquivo =>{
            let id = arquivo._id;
            Serverest.buscarUsuario(id).then(res =>{
                ValidaServerest.validarBuscaUsuarioId(res);
            })
        })    
    })

    it('Deve realizar a busca de um usuário de um arquivo Json e realizar login', () => {  //realiza um login com o último usuário cadastrado (que foi salvo no Json)
        cy.fixture('usuario.json').then(arquivo =>{                                 // não vou deixar esse caso teste no arquivo de Login, pq está dependendo do caso anterior para atualizar o usuário
            let usuario = {
                "email": arquivo.email,
                "password": arquivo.password
            }
            Serverest.logar(usuario).then(res=>{
                ValidaServerest.validarLoginComSucesso(res);
                Serverest.salvarToken(res);
            })
        })    
    })

    
})