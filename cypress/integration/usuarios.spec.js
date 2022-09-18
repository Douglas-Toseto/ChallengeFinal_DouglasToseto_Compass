/// <reference types="cypress" />

describe('Casos de teste sobre a rota /usuarios da API serverest', function() {
    it('Deve buscar todos os usuarios cadastrados na API',() => {
        cy.request('/usuarios').then(res => {                       //padrão: .request usa GET
            expect(res.status).to.eq(200);
            expect(res).to.be.a('object');
            expect(res.body.quantidade).to.be.a('number');
            expect(res.body.quantidade).to.be.greaterThan(0)
        })
    })

    it('Não deve cadastrar usuário adm duplicado', () => {
        cy.postarUsuarioDuplicado().then(res => {
            expect(res).to.be.a('object');
            cy.log(JSON.stringify(res));
            expect(res.body.message).to.be.equal('Este email já está sendo usado')
            
        })
    })
        /*
        cy.request({
            method: 'POST',
            url: '/usuarios',
            failOnStatusCode: false, //caso contrário os testes param qdo o retorno não é 200
            body: {                             //por algum motivo está retornando status 200 e realizando o POST  <<<<
                "nome": "Stephen Lynch",    
                "email": "Cortez80@yahoo.com",
                "password": "FFfGeIM80cpNNQt",
                "administrador": "false"
            }
        }).then(res => {
            expect(res).to.be.a('object');
            cy.log(res.body)
            //expect(res.body.message).to.be.a('string');
            //expect(res.body.message).to.be.eq('Este email já está sendo usado')
        }) */
    

    it('Validando request com comando personalizado', () =>{
        cy.rest('GET', '/usuarios').then(res => {
            expect(res).to.be.a('object');
            expect(res.body).to.have.ownProperty('usuarios')
        })
    })

    it('Validando consulta por id de usuário cadastrado', () => {
        cy.request('/usuarios/gAPluNwg6sYmAaTE').then(res => {
            expect(res).to.be.a('object');
            cy.log(JSON.stringify(res));
        })
    })

    it.only('Deve realizar login com sucesso', ()=>{
        cy.buscarUsuarioParaLogin().then(usuario =>{
            cy.logar(usuario.email, usuario.senha).then(res =>{
                expect(res).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('Login realizado com sucesso');
                expect(res.body).to.haveOwnProperty('authorization');
                let bearer = res.body.authorization.slice(7);
                cy.log(bearer);
            })
        })

    })

    it('Deve realizar cadastro de usuário', ()=>{
        cy.request({
            "method": 'POST',
            "url": '/usuarios',
            "failOnStatusCode": false,
            "body":{
                "nome": "TESTANDO333",
                "email": "TESTANDO333@gmail.com",
                "password": "TESTANDO333",
                "administrador": "true"
            }
        }).then( res => {
            cy.log(JSON.stringify(res));
            /*expect(res.body).to.have.ownProperty('message');
            expect(res.body.message).to.equal('Cadastro realizado com sucesso');
            expect(res).to.have.ownProperty('_id');
            let id_usuario = res.body._id;*/
        })
    }) 

    
})

