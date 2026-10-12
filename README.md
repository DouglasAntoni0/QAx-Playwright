<div align="center">

# 🎭 QAx Playwright — Automação de Testes E2E

**Projeto de estudo em automação de testes com Playwright e TypeScript, desenvolvido por [Douglas Antonio](https://github.com/DouglasAntoni0).**

[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.17-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Status](https://img.shields.io/badge/status-em%20evolução-orange?style=for-the-badge)](#roadmap)

</div>

## Sobre o projeto

Este repositório registra minha evolução prática em **Qualidade de Software e Automação de Testes**, a partir do curso **[Playwright eXpress](https://www.udemy.com/course/playwright-express/)**, da Udemy, ministrado por **Fernando Papito (QAx)**.

Estou construindo uma suíte de testes para o **Mark L**, um gerenciador de tarefas com interface web, API REST e banco SQLite. O projeto reúne escrita de cenários, preparação de dados pela API, interação com o navegador e validação do comportamento esperado.

Meu trabalho aqui envolve compreender o fluxo completo da aplicação: organizar o ambiente, escolher os elementos da interface, controlar os dados usados nos testes, investigar falhas e confirmar os resultados. Cada evolução do repositório representa a aplicação prática de um novo aprendizado.

> **Este é um projeto de estudo em desenvolvimento contínuo. Conforme avanço no curso e nos estudos, o código vai melhorando: novos cenários são adicionados, a organização evolui e os testes existentes são refinados. O histórico de commits registra esse processo.**

## Competências aplicadas

| Competência | Evidência no projeto |
| --- | --- |
| **Automação E2E com Playwright** | Cenários executados em Chromium contra a aplicação local, com interação e validação da interface |
| **Integração entre API e UI** | Limpeza da tarefa pela API antes do cadastro pelo navegador |
| **Controle da massa de testes** | Exclusão pelo nome da tarefa e verificação do status `204` antes de continuar o cenário |
| **Validação do comportamento esperado** | Verificação do título da página e da visibilidade da tarefa cadastrada |
| **Investigação de falhas** | Diagnóstico da porta incorreta do helper e da incompatibilidade entre o Node.js e o módulo nativo SQLite |
| **Organização do projeto** | Aplicações em `apps/`, cenários em `tests/` e configuração do runner em arquivo próprio |
| **TypeScript** | Cenários escritos em TypeScript, com configuração `strict: true` |
| **Evidências de execução** | Relatório HTML do Playwright e trace configurado para a primeira tentativa de retry |

Essas entregas mostram minha evolução na construção de testes que verificam resultados, cuidam dos dados utilizados e tornam as falhas mais fáceis de investigar. O foco dos estudos é desenvolver uma base técnica consistente para ampliar a automação com segurança e clareza.

## Validação realizada

Em **12/10/2026**, a suíte foi executada localmente com a API e o front-end ativos:

- **2 cenários aprovados em cada uma de duas execuções consecutivas**, sem falhas nessas execuções.
- A segunda execução confirmou o funcionamento da limpeza quando a tarefa do teste já estava cadastrada.
- Uma consulta adicional a `GET /tasks` retornou `200` e confirmou uma única tarefa com o nome usado no teste, com `is_done: false`.
- Ambiente utilizado: **Chromium**, **Node.js 22.23.3 para o runner** e **Node.js 18.20.8 para a API**.

Esse resultado corresponde aos dois cenários implementados na suíte Playwright. A ampliação da cobertura está descrita no roadmap.

## Cenários implementados

| Arquivo | Cenário | Verificações |
| --- | --- | --- |
| [`home.spec.ts`](playwright-mark/tests/home.spec.ts) | Web app deve estar online | Abre a interface e verifica o título `Gerencie suas tarefas com Mark L` |
| [`tasks.spec.ts`](playwright-mark/tests/tasks.spec.ts) | Deve poder cadastrar uma nova tarefa | Limpa a tarefa pela API, exige `204`, preenche o nome, clica em `Create` e verifica a tarefa na lista |

O cadastro utiliza o nome fixo `Ler um livro de TypeScript`. A limpeza acontece antes de cada execução desse cenário. O Faker já está instalado como dependência de desenvolvimento; a geração de nomes dinâmicos faz parte dos próximos estudos.

## Stack e ambiente

| Componente | Tecnologias | Endereço local |
| --- | --- | --- |
| Suíte de testes | Playwright Test `^1.63.0`, TypeScript e Faker `^10.6.0` | Runner na pasta `playwright-mark/` |
| Front-end Mark L | SPA compilada, servida com `http-server` | `http://localhost:8080` |
| API Mark L | Node.js, Express, TypeORM, Yup e UUID | `http://localhost:3333/tasks` |
| Persistência | SQLite com `better-sqlite3` `8.2.0` | Banco local da aplicação |

**As portas têm funções diferentes:** a navegação da interface usa `8080`; as chamadas de API, incluindo `/helper/tasks`, usam `3333`.

### Versões do Node.js

- **API:** validada com Node.js **18.20.8**, compatível com o módulo SQLite instalado neste ambiente.
- **Front-end e testes:** validados com Node.js **22.23.3**. O arquivo [`playwright-mark/.node-version`](playwright-mark/.node-version) indica a versão principal `22`.

O SQLite utiliza um módulo nativo. Dependências instaladas ou compiladas com uma versão do Node.js podem falhar ao iniciar com outra versão. Durante a investigação local, executar a API com Node.js 26 causou `ERR_DLOPEN_FAILED`; selecionar Node.js 18 resolveu a inicialização com as dependências existentes.

## Estrutura do repositório

```text
QAx-Playwright/
├── README.md
├── Insomnia_markL.json          # Coleção de requisições para explorar a API
└── playwright-mark/
    ├── apps/
    │   ├── api/                # API e banco SQLite — porta 3333
    │   │   ├── src/
    │   │   │   ├── controllers/
    │   │   │   ├── database/
    │   │   │   ├── models/
    │   │   │   ├── repositories/
    │   │   │   ├── routes.js
    │   │   │   └── server.js
    │   │   └── package.json
    │   └── web/                # Interface compilada — porta 8080
    ├── tests/
    │   ├── home.spec.ts
    │   └── tasks.spec.ts
    ├── .node-version
    ├── package.json
    ├── playwright.config.ts
    └── tsconfig.json
```

## Como executar

Os exemplos abaixo usam PowerShell e `fnm` para selecionar a versão do Node.js em cada terminal. Também é possível utilizar outro gerenciador, mantendo as versões correspondentes. É necessário ter Git instalado.

### 1. Clonar o projeto

```powershell
git clone https://github.com/DouglasAntoni0/QAx-Playwright.git
cd QAx-Playwright
```

### 2. Iniciar a API — terminal 1

Partindo da raiz do repositório:

```powershell
cd playwright-mark/apps/api
fnm install 18.20.8
fnm use 18.20.8
node -v
npm ci
npm run dev
```

Deixe esse terminal aberto. Para conferir a API, acesse `http://localhost:3333/tasks`: a resposta deve ser uma lista JSON. A raiz `http://localhost:3333/` retorna `Cannot GET /`, pois não há uma rota definida para esse caminho.

Se precisar criar as tabelas em um banco novo, execute `npm run db:init` antes de iniciar a API.

### 3. Iniciar a interface — terminal 2

Em outro terminal, partindo da raiz do repositório:

```powershell
cd playwright-mark/apps/web
fnm install 22.23.3
fnm use 22.23.3
npm ci
npm run dev
```

Deixe esse terminal aberto e acesse `http://localhost:8080`.

### 4. Executar os testes — terminal 3

Em outro terminal, partindo da raiz do repositório:

```powershell
cd playwright-mark
fnm use 22.23.3
npm ci
npx playwright install chromium
npm test
```

Outras formas de executar e consultar as evidências:

```powershell
npm run test:ui
npx playwright test tests/tasks.spec.ts
npx playwright show-report
```

O Playwright gera o relatório em `playwright-mark/playwright-report/` e os resultados em `playwright-mark/test-results/`. Esses diretórios são ignorados pelo Git.

### Depois de reiniciar o computador

Se as dependências já estiverem instaladas, selecione novamente a versão do Node.js em cada terminal e execute `npm run dev` nas pastas da API e da interface. Com os dois serviços ativos, execute `npm test` na pasta `playwright-mark/`. O início dos serviços ainda é manual.

## Rotas disponíveis na API

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/tasks` | Lista tarefas |
| `POST` | `/tasks` | Cadastra uma tarefa |
| `PUT` | `/tasks/:id` | Atualiza o estado de conclusão |
| `DELETE` | `/tasks/:id` | Exclui uma tarefa pelo ID |
| `DELETE` | `/helper/tasks` | Exclui pelo nome informado no corpo JSON |
| `DELETE` | `/helper/tasks/:task_name` | Exclui pelo nome informado na URL |

As rotas `/helper/*` são habilitadas quando `NODE_ENV !== 'production'`. O cenário de cadastro usa a rota com o nome na URL, codificado com `encodeURIComponent`, e valida o status da resposta antes de interagir com a interface.

A coleção [`Insomnia_markL.json`](Insomnia_markL.json) contém requisições de cadastro, listagem, atualização e exclusão. Os IDs das requisições de atualização e exclusão devem ser substituídos pelos IDs de tarefas existentes.

## Configuração atual do Playwright

O arquivo [`playwright.config.ts`](playwright-mark/playwright.config.ts) configura:

- Execução em **Chromium**.
- Paralelismo com `fullyParallel: true`.
- Relatório HTML.
- Trace na primeira tentativa de retry.
- Em ambiente `CI`: um worker, duas tentativas adicionais e bloqueio de `test.only`.

As URLs estão escritas diretamente nos testes. A inicialização automática dos serviços, a execução em outros navegadores e um workflow no GitHub Actions são melhorias previstas.

## Roadmap

- [x] Organizar o projeto com Playwright e TypeScript.
- [x] Executar o Mark L com interface, API e banco local.
- [x] Implementar e validar o smoke test da página inicial.
- [x] Implementar e validar o cadastro de uma tarefa.
- [x] Preparar a massa pela API e verificar o retorno da limpeza.
- [x] Confirmar o cadastro em duas execuções consecutivas.
- [ ] Validar tarefa duplicada e campo obrigatório.
- [ ] Automatizar conclusão e exclusão pela interface.
- [ ] Gerar massa dinâmica com Faker.
- [ ] Ampliar os cenários de API.
- [ ] Evoluir a organização com Page Objects e fixtures.
- [ ] Centralizar URLs com `baseURL` e variáveis de ambiente.
- [ ] Automatizar o início dos serviços pelo runner.
- [ ] Executar em Firefox, WebKit e dispositivos móveis.
- [ ] Criar uma pipeline no GitHub Actions com publicação de evidências.

## Referência e autoria

**Curso:** [Playwright eXpress — Udemy](https://www.udemy.com/course/playwright-express/), de Fernando Papito (QAx).

A aplicação **Mark L** é material de apoio do curso. A implementação e a evolução da suíte neste repositório são desenvolvidas por **Douglas Antonio**, acompanhando os exercícios e aplicando os conhecimentos adquiridos nos estudos.

Este projeto documenta minha dedicação à prática de automação, à investigação de problemas e à melhoria contínua do código. Conforme avanço, cada etapa ganha novos cenários, verificações e formas de organizar os testes.

**Autor:** [Douglas Antonio](https://github.com/DouglasAntoni0) · [douglas.doug1235@gmail.com](mailto:douglas.doug1235@gmail.com)
