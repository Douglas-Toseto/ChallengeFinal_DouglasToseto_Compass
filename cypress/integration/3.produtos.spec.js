/// <reference types="cypress" />

import { validateAdditionalItems } from 'ajv/dist/vocabularies/applicator/additionalItems'
import Serverest from '../services/serverest.service'
import ValidaServerest from '../services/validaServerest.service' 
import { faker } from '@faker-js/faker'
import Factory from '../fixtures/factory'


describe('Casos de teste relacionados a rota /produtos da API Serverest', ()=>{

    //------------------------- GET ------------------------------------------------------------------------------------------------------------------
    it('Deve retornar todos os produtos cadastrados', ()=>{
        Serverest.buscarProdutos().then(res => {
            cy.contractValidation(res, 'get_produtos', 200);
            //ValidaServerest.validarBuscaProdutos(res);
            expect(res.status).to.be.eq(200);
            expect(res.body.quantidade).to.be.greaterThan(0);
            cy.writeFile('cypress/fixtures/produto.json', res.body.produtos[res.body.produtos.length-1]) // salva as informações do último produto cadastrado num JSON
        })
    })

    it('Deve retornar um produto com ID especifico',()=>{
        cy.fixture('produto.json').then(produto => {
            let idProduto = produto._id;
            Serverest.buscarProdutoPorId(idProduto).then(res => {
                cy.contractValidation(res, 'get_produtos_by_id', 200);
                expect(res.status).to.be.eq(200);
                cy.log(JSON.stringify(produto))
            })
        })
        
    })

    it('Deve falhar ao buscar um produto por ID inexistente', ()=>{
        let idProduto = faker.datatype.number();
        Serverest.buscarProdutoPorId(idProduto).then(res =>{
            cy.contractValidation(res,'get_produtos_by_id', 400);
            ValidaServerest.validaBuscaProdutoPorIdSemSucesso(res);
        })

    })


    // --------------------------------------- POST ------------------------------------------------------------------------------------------------
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
        
        it('Deve cadastrar um produto com sucesso', () => {
            Serverest.cadastrarProdutoComSucesso().then(res => {           
                cy.contractValidation(res, 'post_produtos', 201);
                ValidaServerest.validaCadastrarProdutoComSucesso(res);
            })
        })


        // Atenção >>>
        it('Deve falhar ao tentar cadastrar um produto repetido', () => {
            Serverest.cadastrarProdutoRepetido().then(res => {    //ERRO NO THEN (ou no obj retornado) <<<<<<<<<<<<<<<<<<<<<
                cy.log(res)
                cy.contractValidation(res, 'post_produtos', 400);
                ValidaServerest.validaCadatrarProdutoRepetido(res);
            })
        })

    })


    it('Deve falhar ao tentar cadastrar usuário sem token', () => {
        Serverest.cadastrarProdutoSemToken().then(res => {           
            cy.contractValidation(res, 'post_produtos', 401);
            ValidaServerest.validaCadastrarProdutoSemToken(res);
        })
    })
   
    

//------------------------ PUT -----------------------------------------------------------------------------------------------
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

        //antes de realizar esse caso de teste, realizar antes o GET para salvar um produto no JSON
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

        it('Deve cadastrar um produto ao tentar realizar uma alteração por um ID inexistente', () => {
            let produto = Factory.gerarProduto();
            let idProduto = faker.datatype.number();
            Serverest.alterarProduto(idProduto, produto).then(res => {    //não é necessário criar uma nova função, basta que o ID seja inexistente
                cy.contractValidation(res, 'put_produtos', 201);
                ValidaServerest.validaCadastroComPut(res);
                produto._id = res.body._id;    //ao cadastrar um novo produto, é atribuido um novo ID (e não aquele número aleatório)
                cy.writeFile('cypress/fixtures/produto.json', produto); //atualiza o ultimo produto salvo no Json
            })
        })

        //SE EU EXECUTAR TODOS OS TESTES SEM ESSE, E DEPOIS ESSE ISOLADAMENTE, OCORRE COMO O ESPERADO
        //SE EXECUTAR EM SEQUENCIA, RETORNA 201 - NOVO CADASTRO
        //????
        //Parece que usar o cy.wrap resolveu o problema e deixou o teste mais isolado
        it('Deve falhar ao tentar cadastrar um produto com nome repetido', () => {    
            Serverest.salvarProduto();
            cy.get('@produtoSalvo').then(produto => {
                let produtoNovo = Factory.gerarProduto();
                produtoNovo.nome = produto.nome;
                let idProdutoNovo = faker.datatype.number(); //ID aleatório, com isso o PUT tenta cadastrar um novo produto usando um nome existente
                Serverest.alterarProduto(idProdutoNovo, produtoNovo).then(res => {
                    cy.contractValidation(res, 'put_produtos', 400);
                    ValidaServerest.validaProdutoDuplicado(res); 
                })
                
            })
            /*
            cy.fixture('produto.json').then(arquivo => {
                cy.log(JSON.stringify(arquivo))
                let produto = Factory.gerarProduto();
                produto.nome = arquivo.nome; //para ficar com o nome repetido;
                let idProduto = faker.datatype.number(); //id aleatória 
                Serverest.alterarProduto(idProduto, produto).then(res => {
                    cy.contractValidation(res, 'put_produtos', 400);
                    ValidaServerest.validaProdutoDuplicado(res);
                })
            })*/

        })

    })



    //-------------- DELETE ---------------------------------------------------------------------------------------------------
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

        it('Deve deletar um produto com ID específico', ()=>{
            cy.fixture('produto.json').then(arquivo =>{ //vamos excluir último produto salvo no JSON
                let idProduto = arquivo._id;
                Serverest.excluirProduto(idProduto).then(res=>{
                    cy.contractValidation(res, 'delete_produtos', 200);
                    ValidaServerest.validaExcluirProduto(res);
                })
            })
            
        })
    })

    it('Deve falhar ao tentar excluir usuário sem token', () => {
        Serverest.excluirProdutoSemToken().then(res => {           
            cy.contractValidation(res, 'delete_produtos', 401);
            ValidaServerest.validaExcluirProdutoSemToken(res);
        })
    })


// DELETE para status 400 >>> depende da existência de carrinho


})