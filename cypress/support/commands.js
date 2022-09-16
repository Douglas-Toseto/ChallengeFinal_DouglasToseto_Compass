import Ajv from 'ajv';
const ajv = new Ajv({allErrors: true, verbose: true, strict: false});

Cypress.Commands.add('contractValidation', (res, schema, status)=>{   //validar esquemas com AJV
    cy.fixture(`schemas/${schema}/${status}.json`).then( schema => {
        const validate = ajv.compile(schema);       
        const valid = validate(res.body);

        //cy.log(JSON.stringify(validate.errors));
        if(!valid){
            var errors = '';
            for (let i in validate.errors){
                let err = validate.errors[i];
                errors += `\n ${err.instancePath} ${err.message}, but received a ${typeof err.data}`;
                throw new Error('Erros encontrados na validação de contrato, por favor verifique: '+ errors);
            }
        } else { cy.log('Contrato válido')}
    })
})

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