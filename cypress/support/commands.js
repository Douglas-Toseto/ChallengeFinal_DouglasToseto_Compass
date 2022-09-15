Cypress.Commands.add('postarUsuarioDuplicado', () => {
    return cy.request({
        "method": 'POST',
        "url": '/usuarios',
        "failOnStatusCode": false, //caso contrário os testes param qdo o retorno não é 200
        "body": {                             
            "nome": "TESTE2",
            "email": "TESTE2@TESTE.COM",
            "password": "TESTANDO123TESTANDO",
            "administrador": "true"
        }
    })
})

Cypress.Commands.add('rest', (method='GET', url='/', body=null, failOnStatusCode=false) => {
    return cy.request({
        method: method,
        url: url,
        body: body,
        failOnStatusCode: failOnStatusCode
    })
})

Cypress.Commands.add('logar', (email, senha) => {
    cy.request({
        method: 'POST',
        url: '/login',
        failOnStatusCode: false, 
        body: {                  
            "email": email,
            "password": senha
        } 
    })
})

Cypress.Commands.add('buscarUsuarioParaLogin', () => {
    cy.rest('GET','/usuarios').then(res => {
        expect(res.body).to.haveOwnProperty('usuarios');
        return {
            "email": res.body.usuarios[0].email,
            "senha": res.body.usuarios[0].password
        }
    })
})

//Código do Eduardo:
Cypress.Commands.add('postarUsuarioSemSucesso', () => {
    return cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'Teagan Wunsch',
        email: 'automation-postUserKenna.Bashirian@gmail.com',
        password: '1234',
        administrador: 'true'
      }
    })
})