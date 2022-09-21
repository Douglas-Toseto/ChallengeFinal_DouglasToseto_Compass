 # :computer: Challenge Sprint 5 :computer:
![Template de Apresentação!](/assets/template.png)

 ![](https://img.shields.io/badge/-JavaScript-yellow)

>

Sprint 5 da trilha **Logical Forest** do programa de bolsas da Compass.UOL, cujo tema é *Automação de testes de API com Cypress*.

>

### :rocket: Objetivos da Sprint:

- Se familiarizar com a ferramenta **Cypress**,
- Aprender a realizar as configurações iniciais de um projeto Cypress,
- Aprender a configurar ambientes dinâmicos no Cypress,
- Utilizar a API **Serverest** como objeto de estudo para análise e mapeamento de rotas, com o auxílio das ferramentas Postman e Xmind, 
- Entender a estrutura de **comandos personalizados** do Cypress,
- Aprender sobre o Design Pattern **Service Object**,
- Aprender conceitos relacionados a **Massa de dados fixas e dinâmicas** e conhecer a biblioteca **faker-js**,
- Aprender o conceito de *Schemas*, a realizar **testes de contrato de APIs** e conhecer a biblioteca **Ajv**,
- Realizar atividades práticas relacionadas testes (adicionando novos casos de testes relacionados às rotas da API Serverest),
- Organizar um repositório.

>

### :coffee: Dependências/Recursos necessários:
Para a realização das atividades propostas, foram utilizados os seguintes recursos:

- [Node.Js](https://nodejs.org/en/)
>
- [Visual Studio Code](https://code.visualstudio.com)
>
- Cypress versão 9.7.0:
```bash
npm install --save-dev cypress@9.7.0
```
>
- [Postman](https://www.postman.com)
> 
- [Xmind](https://xmind.app)
>

- Biblioteca faker-js:
```bash
npm install @faker-js/faker --save-dev
```

- Biblioteca Ajv:
```bash
npm install --save-dev ajv
```

- Plugin/complemento cypress-mochawesome-reporter:
```bash
npm install --save-dev cypress-mochawesome-reporter
```
>

### :cd: Execução dos testes
Os casos de testes se encontram na pasta `cypress/integration/`. Foram definidos comandos personalizados, que se encontram em `cypress/support/commands.js`. Também foi utilizado o *design pattern Service Object* como guia de organização, com os métodos que realizam as ações da API testada sendo descritos em `cypress/services/serverest.service.js` e os métodos que realizam as validações descritos em `cypress/services/validaServerest.service.js`. Os reports gerados pelo complemento mochawesome ficam em `cypress/reports/html`.

Para realizar os testes abrindo a interface gráfica do Cypress em ambiente de produção:
```
npm run cy:open:prod
```

Para executar o Cypress, e gerar o *Report Automatizado* (utilizando o complemento cypress-mochawesome-reporter) de todos os casos de teste em ambiente de produção:
```
npm run cy:run:prod
```
Para executar o Cypress em um ambiente de testes é necessário primeiro executar o comando abaixo, que permite a API ser executada localmente:
```
npx Serverest@latest
```
e então executar os seguintes comandos para abrir o Cypress com interface gráfica e em segundo plano, respectivamente:
```
npm run cy:open
```
```
npm run cy:run
```
>

### :books: Referências:
- [Documentação Serverest](https://serverest.dev)
- [Github da Serverest](https://github.com/serverest/serverest)
- [Documentação Cypress](https://docs.cypress.io/guides/overview/why-cypress)
- [Artigo: "npm x npx - qual a diferença"](https://www.freecodecamp.org/portuguese/news/npm-x-npx-qual-e-a-diferenca/)
- [Documentação faker-js](https://fakerjs.dev/guide/)
- [Documentação Ajv](https://ajv.js.org/guide/getting-started.html)
- [Artigo: "What is a schema?"](http://json-schema.org/understanding-json-schema/about.html)
- [JSON Schema tool](https://jsonschema.net/app/schemas/0)
- [Vídeo: Generate HTML Report In Cypress | MochAwesome Reporter](https://youtu.be/aR74j4Hk0vo)
- [Documentação cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter)




>

### :ribbon: Agradecimentos:
Agradeço aos colegas de trilha pelas conversas, dicas, compartilhamento de material e vídeos e pela disposição em discutir erros de código. Em especial ao Eduardo por ter me ajudado a encontrar um erro de digitação em um dos arquivos de digitação e ao Nosvaldo pelos vídeos acertivos que indica!

Agradeço também à Larissa, pela paciência com as dúvidas!

E ao Jacques e Matheus pelas dicas na mentoria!

>

### :baby: Autor:
Douglas Toseto Marçal de Oliveira

Contato: [LinkedIn](https://www.linkedin.com/in/douglas-toseto/ )