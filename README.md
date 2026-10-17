<div align="center">

# 🎭 QAx Playwright — Arquitetura & Automação de Testes E2E

**Suíte de automação de testes End-to-End (UI + API) construída com Playwright e TypeScript por [Douglas Antonio](https://github.com/DouglasAntoni0).**

[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2018-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.17-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tests](https://img.shields.io/badge/Testes-3%20Passing%20(1.7s)-brightgreen?style=for-the-badge)](#validação-e-resultados-de-execução)

</div>

---

## 🎯 Visão Geral e Propósito

Este repositório apresenta meu trabalho prático em **Engenharia de Qualidade de Software (QA) e Automação de Testes E2E**, desenvolvido ao longo do curso **[Playwright eXpress](https://www.udemy.com/course/playwright-express/)** (QAx / Fernando Papito) e expandido com foco em **boas práticas de arquitetura, código limpo, tipagem forte e confiabilidade de execução**.

Mais do que reproduzir exercícios, meu objetivo neste projeto é **construir uma suíte de testes com padrão profissional de mercado** sobre a aplicação full-stack **Mark L** (gerenciador de tarefas com SPA Web, API REST em Express/TypeORM e banco SQLite). Cada commit reflete decisões técnicas voltadas para **testes rápidos, independentes, idempotentes e de fácil manutenção**.

> 💡 **Evolução contínua:** Este projeto é atualizado a cada avanço nos estudos. O código passa constantemente por refatorações para aplicar padrões de projeto (*Design Patterns*), isolamento de responsabilidades (*DRY*) e automação híbrida (*API + UI*).

---

## 🏆 Diferenciais Técnicos e Competências Aplicadas por Mim

| Competência de Engenharia de QA | Como eu apliquei na prática neste projeto |
| --- | --- |
| **Estratégia Híbrida (API + UI)** | Em vez de depender apenas da interface (lenta e propensa a *flakiness*) para preparar cenários, utilizo o `APIRequestContext` do Playwright para limpar e pré-cadastrar dados diretamente na API REST antes de validar o comportamento no navegador. |
| **Clean Code, DRY e Modularização** | Refatorei chamadas HTTP repetidas nos testes para uma camada dedicada de suporte ([`tests/support/helpers.ts`](playwright-mark/tests/support/helpers.ts)), mantendo os arquivos `.spec.ts` enxutos, legíveis e focados na regra de negócio. |
| **Modelagem e Tipagem Estrita em TypeScript** | Criei contratos de dados fortemente tipados ([`TaskModel`](playwright-mark/tests/fixtures/task.model.ts)) com `strict: true`, prevenindo erros em tempo de desenvolvimento e garantindo *autocomplete* seguro em toda a suíte. |
| **Independência e Idempotência de Testes** | Cada cenário controla sua própria massa de dados (`deleteTaskByHelper` + `postTask`), permitindo execução **100% paralela (`3 workers`)** em apenas **1.7s**, sem efeito colateral entre testes ou falhas por sujeira no banco. |
| **Cobertura de Fluxos Positivos e Regras de Negócio** | Validação tanto do *happy path* (criação e renderização de tarefas no DOM) quanto de fluxos de exceção (bloqueio de tarefa duplicada e validação de componente modal **SweetAlert2**). |
| **Troubleshooting de Ambiente e Infraestrutura** | Diagnóstico e resolução de incompatibilidade binária (`ERR_DLOPEN_FAILED`) do módulo nativo `better-sqlite3` em versões recentes do Node.js, estruturando o ambiente com gerenciamento multi-versão (`Node 18.20.8` na API e `Node 22.23.3` no runner). |
| **Observabilidade e Diagnóstico de Falhas** | Configuração de **HTML Reporter**, **UI Mode** e **Trace Viewer** (`on-first-retry`) para inspeção completa de rede, DOM, *snapshots* e console. |

---

## ✨ Destaques da Arquitetura da Suíte

### 1. Contratos de Dados Tipados (`tests/fixtures/task.model.ts`)
Para evitar objetos literais soltos e garantir consistência entre o payload da API e os dados preenchidos na UI, estruturei a interface `TaskModel`:

```ts
export interface TaskModel {
    name: string
    is_done: boolean
}
```

### 2. Camada de Helpers de API Reutilizáveis (`tests/support/helpers.ts`)
Abstraí a preparação e limpeza de estado em funções assíncronas reutilizáveis que validam o retorno HTTP antes de prosseguir com o teste:

```ts
import { expect, APIRequestContext } from '@playwright/test'
import { TaskModel } from '../fixtures/task.model'

export async function deleteTaskByHelper(request: APIRequestContext, taskName: string) {
    const response = await request.delete(`http://localhost:3333/helper/tasks/${taskName}`)
    expect(response.ok()).toBeTruthy()
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
    const newTask = await request.post('http://localhost:3333/tasks', { data: task })
    expect(newTask.ok()).toBeTruthy()
}
```

### 3. Testes Limpos no Padrão AAA — *Arrange, Act, Assert* (`tests/tasks.spec.ts`)
Com os *helpers* e *models* isolados, os testes ficam extremamente claros e diretos:

```ts
test('não deve permitir tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Comprar ketchup',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)

    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})
```

---

## 🧪 Cenários Implementados e Validação

### Matriz de Cenários Atuais

| # | Arquivo | Cenário | Estratégia Aplicada | Status |
| --- | --- | --- | --- | --- |
| 1 | [`home.spec.ts`](playwright-mark/tests/home.spec.ts) | `webapp deve estar online` | Smoke test de disponibilidade e validação do `<title>` da aplicação | ✅ Passando |
| 2 | [`tasks.spec.ts`](playwright-mark/tests/tasks.spec.ts) | `deve poder cadastrar uma nova tarefa` | Limpeza prévia via API (`DELETE /helper/tasks/:name`), cadastro via UI e asserção de visibilidade na lista | ✅ Passando |
| 3 | [`tasks.spec.ts`](playwright-mark/tests/tasks.spec.ts) | `não deve permitir tarefa duplicada` | Limpeza + *seed* da tarefa via API (`POST /tasks`), tentativa de recadastro via UI e asserção do modal `.swal2-html-container` (`Task already exists!`) | ✅ Passando |

### Validação e Resultados de Execução

Em **17/10/2026**, a suíte completa foi executada com **3 workers em paralelo** no Chromium:

- **3 cenários aprovados (`3 passed` em `1.7s`)**, com zero falhas ou *flakiness*.
- Execuções consecutivas confirmaram que os *helpers* de API mantêm o banco SQLite sempre no estado esperado antes de cada teste.
- Ambiente validado com **Node.js 22.23.3** (Playwright Runner + Web) e **Node.js 18.20.8** (API REST + SQLite).

---

## 🛠️ Stack Tecnológica e Ambiente

| Camada | Tecnologias Utilizadas | Endereço Local |
| --- | --- | --- |
| **Suíte de Automação** | Playwright Test `^1.63.0`, TypeScript (`strict: true`), Faker `^10.6.0` | Pasta `playwright-mark/` |
| **Front-end (SUT)** | SPA React compilada, servida via `http-server` | `http://localhost:8080` |
| **API REST (SUT)** | Node.js, Express `4.17`, TypeORM, Yup, UUID | `http://localhost:3333/tasks` |
| **Banco de Dados** | SQLite 3 (`better-sqlite3` `8.2.0`) | Arquivo local em `apps/api/src/database/` |

> ⚠️ **Nota técnica sobre versões do Node.js (Troubleshooting):**
> O pacote `better-sqlite3` utiliza *addons* nativos em C++. Durante o setup do ambiente, identifiquei que versões mais recentes do Node.js geravam a falha `ERR_DLOPEN_FAILED` ao carregar o binário da API. Resolvi o problema isolando a API no **Node.js 18.20.8** (via `fnm`) enquanto a suíte Playwright e o servidor web rodam no **Node.js 22.23.3** (definido em [`playwright-mark/.node-version`](playwright-mark/.node-version)).

---

## 🗂️ Estrutura do Repositório

```text
QAx-Playwright/
├── README.md
├── Insomnia_markL.json                 # Coleção Insomnia para exploração manual e testes de API
└── playwright-mark/
    ├── apps/
    │   ├── api/                        # API REST + TypeORM + SQLite (porta 3333)
    │   │   ├── src/
    │   │   │   ├── controllers/        # TaskController (CRUD + rotas /helper)
    │   │   │   ├── database/           # Conexão, migrations e arquivo SQLite
    │   │   │   ├── errors/             # Tratamento padronizado de erros (AppError)
    │   │   │   ├── models/             # Entidade Task
    │   │   │   ├── repositories/       # TasksRepository
    │   │   │   ├── routes.js           # Definição das rotas da API
    │   │   │   └── server.js           # Inicialização na porta 3333
    │   │   └── package.json
    │   └── web/                        # Front-end SPA do Mark L (porta 8080)
    ├── tests/                          # 🎭 Suíte de Testes E2E (Playwright + TypeScript)
    │   ├── fixtures/
    │   │   └── task.model.ts           # Interface e tipagem do modelo TaskModel
    │   ├── support/
    │   │   └── helpers.ts              # Helpers reutilizáveis de API (deleteTaskByHelper, postTask)
    │   ├── home.spec.ts                # Smoke test da página inicial
    │   └── tasks.spec.ts               # Cenários de cadastro e regras de negócio de tarefas
    ├── .node-version                   # Versão principal do Node.js (22)
    ├── package.json
    ├── playwright.config.ts            # Configuração do runner, paralelismo, retries e trace
    └── tsconfig.json                   # TypeScript configurado com strict: true
```

---

## 🌐 Rotas da API (Mark L)

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/tasks` | Lista todas as tarefas cadastradas |
| `POST` | `/tasks` | Cadastra uma nova tarefa (`{ name, is_done }`) |
| `PUT` | `/tasks/:id` | Atualiza o status de conclusão (`is_done`) |
| `DELETE` | `/tasks/:id` | Remove uma tarefa pelo UUID |
| `DELETE` | `/helper/tasks` | 🧪 *Helper de teste:* exclui tarefa pelo nome no corpo JSON |
| `DELETE` | `/helper/tasks/:task_name` | 🧪 *Helper de teste:* exclui tarefa pelo nome na URL |

As rotas `/helper/*` ficam ativas apenas quando `NODE_ENV !== 'production'`, permitindo limpeza rápida do estado do banco antes de cada cenário. A coleção [`Insomnia_markL.json`](Insomnia_markL.json) na raiz do projeto também documenta essas chamadas.

---

## 🚀 Como Executar o Projeto Localmente

Os comandos abaixo utilizam **PowerShell** e o gerenciador de versões **`fnm`** (você também pode usar `nvm`).

### 1. Clonar o repositório

```powershell
git clone https://github.com/DouglasAntoni0/QAx-Playwright.git
cd QAx-Playwright
```

### 2. Iniciar a API — Terminal 1

```powershell
cd playwright-mark/apps/api
fnm install 18.20.8
fnm use 18.20.8
npm ci
npm run dev
```
> A API ficará ativa em `http://localhost:3333/tasks`. Caso precise inicializar um banco limpo, rode `npm run db:init` antes de `npm run dev`.

### 3. Iniciar a Interface Web — Terminal 2

```powershell
cd playwright-mark/apps/web
fnm install 22.23.3
fnm use 22.23.3
npm ci
npm run dev
```
> A aplicação web ficará disponível em `http://localhost:8080`.

### 4. Executar a Suíte de Testes — Terminal 3

```powershell
cd playwright-mark
fnm use 22.23.3
npm ci
npx playwright install chromium
npm test
```

Comandos úteis para inspeção e depuração:

```powershell
npm run test:ui                           # Abre o UI Mode interativo do Playwright
npx playwright test tests/tasks.spec.ts   # Executa apenas a suíte de tarefas
npx playwright show-report                # Abre o relatório HTML detalhado
```

---

## 🗺️ Roadmap de Evolução

- [x] Estruturar o projeto com Playwright e TypeScript (`strict: true`)
- [x] Configurar e validar o ambiente completo (Web + API + SQLite)
- [x] Implementar smoke test da página inicial (`home.spec.ts`)
- [x] Implementar teste E2E de cadastro de nova tarefa
- [x] Criar modelagem tipada (`TaskModel`) em `tests/fixtures/`
- [x] Extrair *helpers* reutilizáveis de API (`deleteTaskByHelper` e `postTask`) em `tests/support/`
- [x] Implementar cenário de bloqueio de tarefa duplicada validando modal SweetAlert2
- [ ] Validar obrigatoriedade de campo (submissão vazia)
- [ ] Automatizar conclusão (toggle) e exclusão de tarefas pela interface
- [ ] Centralizar massa de testes em *fixtures* JSON / geração dinâmica com Faker
- [ ] Evoluir a arquitetura para **Page Object Model (POM)**
- [ ] Centralizar URLs com `baseURL` e variáveis de ambiente (`.env`)
- [ ] Configurar execução multi-browser (Chromium, Firefox, WebKit) e pipeline no **GitHub Actions**

---

## 👨‍💻 Sobre o Autor

<table>
  <tr>
    <td align="center" width="140">
      <a href="https://github.com/DouglasAntoni0">
        <img src="https://github.com/DouglasAntoni0.png" width="115" alt="Douglas Antonio"/><br>
        <sub><b>Douglas Antonio</b></sub>
      </a>
    </td>
    <td>
      <b>QA Automation Engineer em evolução contínua | Playwright · TypeScript · Testes E2E & API</b><br><br>
      Sou apaixonado por <b>Qualidade de Software</b> e acredito que testar vai muito além de verificar se um botão funciona: trata-se de construir <b>confiança, velocidade de entrega e prevenção de regressões</b> através de código limpo e bem arquitetado.<br><br>
      Neste repositório, demonstro na prática minha capacidade de estruturar projetos de automação do zero, integrar chamadas de API para otimizar testes de UI, aplicar boas práticas de engenharia de software em TypeScript e diagnosticar problemas reais de ambiente.<br><br>
      📫 <b>Contato:</b> <a href="mailto:douglas.doug1235@gmail.com">douglas.doug1235@gmail.com</a> · 
      🐙 <b>GitHub:</b> <a href="https://github.com/DouglasAntoni0">github.com/DouglasAntoni0</a>
    </td>
  </tr>
</table>

---

<div align="center">

**Referência de estudo:** Curso [Playwright eXpress](https://www.udemy.com/course/playwright-express/) — Fernando Papito (QAx).  
*Suíte de testes, refatorações, arquitetura de suporte e documentação desenvolvidas por **Douglas Antonio**.*

</div>
