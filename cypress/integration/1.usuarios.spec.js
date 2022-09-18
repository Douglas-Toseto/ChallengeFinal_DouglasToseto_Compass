/// <reference types="cypress" />

import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 
import { faker } from '@faker-js/faker'
import Factory from '../fixtures/factory'

describe('Casos de teste relacionados a rota /usuarios da API Serverest', () => {
    
    //--------------------------- GET ------------------------------------------------------------------------------------------------------------------------
    it('Deve retornar todos os usuários cadastrados, fazer validação de contrato e salvar o útimo da lista num json', () => {  //teste para a rota: GET /usuarios
        Serverest.buscarUsuarios().then(res => {
            cy.contractValidation(res, 'get_usuarios', 200);
            //podemos criar outras validações além da validação de contrato
            ValidaServerest.validarBuscaUsuario(res);
            cy.writeFile('cypress/fixtures/usuario.json', res.body.usuarios[res.body.usuarios.length-1])  //salvando o último usuário cadastrado
        })
    })

    it('Deve buscar com sucesso um usuário específico por ID', ()=>{     //teste para rota: GET /usuarios/{_id}
        cy.fixture('usuario.json').then(arquivo =>{
            let id = arquivo._id;
            Serverest.buscarUsuarioPorId(id).then(res =>{
                cy.contractValidation(res, 'get_usuarios_by_id', 200);  
                ValidaServerest.validarBuscaUsuarioId(res);
                //expect(res.status).to.be.equal(200); //OK, a API só deve retornar esse schema qdo o status é 200, mas vai que tem algum erro ai
            })
        })    
    })

    it('Deve falhar ao buscar um usuário específico por ID inexistente', ()=>{     //teste para rota: GET /usuarios/{_id}
        let id = faker.datatype.number();           //número de id aleatório gerado pela faker
        Serverest.buscarUsuarioPorId(id).then(res =>{
            cy.contractValidation(res, 'get_usuarios_by_id', 400);  
            //ValidaServerest.validarBuscaUsuarioId(res);
            expect(res.status).to.be.equal(400); //OK, a API só deve retornar esse schema qdo o status é 200, mas vai que tem algum erro ai
            cy.log(JSON.stringify(res.body))
        })
            
    })

    it('Deve realizar a busca de um usuário de um arquivo Json e realizar login', () => {  //realiza um login com o último usuário cadastrado (salvo no Json)
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


    //------------------------------------- POST --------------------------------------------------------------------------------------------------------------

    it('Deve realizar cadastro de usuário', ()=>{       //teste para rota POST /usuarios
        let usuario = Factory.gerarUsuario();
        Serverest.cadastraUsuario(usuario).then(res => {
            cy.contractValidation(res, 'post_usuarios', 201);
            expect(res.status).to.be.equal(201);
        })   
    })

    it('Deve falhar ao tentar realizar cadastro de um usuário existente', ()=>{       //teste para rota POST /usuarios
        cy.fixture('usuario.json').then(arquivo => {    //coletandos as informações do usuário previamente salvas no json
            let usuario = {
                "nome": arquivo.nome,
                "email": arquivo.email,
                "password": arquivo.password,
                "administrador": "true",
            }
            Serverest.cadastraUsuario(usuario).then(res => {
                cy.contractValidation(res, 'post_usuarios', 400);
                expect(res.status).to.be.equal(400);
                expect(res.body.message).to.be.equal('Este email já está sendo usado'); //caso não haja e-mail no body, a mensagem é diferente
            })
        })
    })


    //----------------------------------- PUT ----------------------------------------------------------------------------------------------------------------
    it('Deve alterar com sucesso o cadastro de um usuário existente', ()=>{
        cy.fixture('usuario.json').then(arquivo => {    //coletandos as informações do usuário previamente salvas no json (vou usar apenas o ID)
            let usuario = Factory.gerarUsuario();       //gerando novas informações aleatórias
            let idUsuario = arquivo._id;                //coletando o ID existente
            Serverest.alteraUsuario(idUsuario, usuario).then(res => {
                cy.contractValidation(res, 'put_usuarios', 200);
                //cy.log(JSON.stringify(res.body))
                expect(res.status).to.be.equal(200);
                expect(res.body.message).to.be.equal('Registro alterado com sucesso');
                usuario._id = idUsuario;
                cy.log(JSON.stringify(usuario));
                cy.writeFile('cypress/fixtures/usuario.json', usuario); //salvando no JSON as informações novas
            })
        })
    })

    it('Deve realizar o cadastro de um usuario ao tentar alterar um registro com id inexistente', ()=>{
        let usuario = Factory.gerarUsuario();
        let idUsuario = faker.datatype.number();
        Serverest.alteraUsuario(idUsuario, usuario).then(res => {
            cy.contractValidation(res, 'put_usuarios', 201);
            expect(res.status).to.be.eq(201);
            expect(res.body.message).to.be.eq('Cadastro realizado com sucesso');
        })
    })
    
    it('Deve falhar ao realizar uma alteração de cadastro com id inexistente e e-mail já cadastrado (ie, seria realizado um novo cadastro com e-mail repetido)', ()=>{
        // cy.wait(3000) 
        cy.fixture('usuario.json').then(arquivo => {    //coletandos as informações do usuário previamente salvas no json
            let usuario = {
                "nome": arquivo.nome,                   // Está ocorrendo conflito com o PUT que realiza alteração com sucesso, parece que não está recuperando as informações atualizadas do JSON
                "email": arquivo.email,             
                "password": arquivo.password,
                "administrador": "true"
            }
            let idUsuario = faker.datatype.number();                    //novo ID aleatório
            //usuario._id = idUsuario;
            //cy.log(JSON.stringify(usuario))
            Serverest.alteraUsuario(idUsuario, usuario).then(res => {       
                cy.contractValidation(res, 'put_usuarios', 400);
                expect(res.status).to.be.eq(400);
                expect(res.body.message).to.be.eq('Este email já está sendo usado');
            })
        })
    })


    //------------------- DELETE ---------------------------------------------------------------------------------------
    it('Deve excluir um usuário com id especificado', ()=>{
        cy.fixture('usuario.json').then(arquivo => {    //vamos excluir o usuário salvo no Json (último do array, e que foi modificado no teste anterior)
            //let idUsuario = arquivo._id;
            let idUsuario = faker.datatype.number();
            Serverest.excluirUsuario(idUsuario).then(res =>{
                cy.contractValidation(res, 'delete_usuarios', 200);
                expect(res.status).to.be.eq(200);
                expect(res.body.message).to.be.eq('Registro excluído com sucesso');
                cy.log(res.body.message)  
            })
        })
    })

    //qdo um registro é excluído, ou qdo não há registro com o ID especificado, em ambos casos o status é 200, variando apenas a mensagem
    //talvez não seja necessário um caso de teste apenas para validar essa situação, apenas validar a mensagem de resposta a depender do ID informado
    /*
    it.only('Deve tentar excluir um usuário com id inexistente', ()=>{
        cy.fixture('usuario.json').then(arquivo => {    //vamos excluir o usuário salvo no Json (último do array, e que foi modificado no teste anterior)
            let idUsuario = faker.datatype.number();    //ao invés de usar o ID do usuário, vou atribuir um número aleatório
            Serverest.excluirUsuario(idUsuario).then(res =>{
                cy.contractValidation(res, 'delete_usuarios', 200);
                expect(res.status).to.be.eq(200);
                expect(res.body.message).to.be.eq('Nenhum registro excluído');
                cy.log(res.body.message)  //qdo um registro é excluído, ou qdo não há registro com o ID especificado, em ambos casos o status é 200, variando apenas a mensagem
            })
        })
    })*/

    // DELETE para status 400 >>> depende da existência de carrinho

})