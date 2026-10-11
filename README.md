<div align="center">

# 🎭 QAx Playwright — Automação de Testes E2E

**Projeto de automação de testes end-to-end com Playwright + TypeScript, desenvolvido por [Douglas Antonio](https://github.com/DouglasAntoni0)**

[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.17-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Status](https://img.shields.io/badge/status-em%20evolução-orange?style=for-the-badge)](#-roadmap)

</div>

---

## 📌 Sobre o projeto

Este repositório documenta a minha jornada na construção de uma **suíte de testes automatizados de ponta a ponta (E2E)** utilizando o **[Playwright](https://playwright.dev/)**, um dos frameworks de automação mais modernos e requisitados do mercado de Qualidade de Software.

O alvo dos testes é o **Mark L**, uma aplicação real de gerenciamento de tarefas (*to-do list*) composta por um **front-end web** e uma **API REST** em Node.js/Express com persistência em SQLite. Ou seja: não é um "hello world" — é um sistema completo, rodando localmente, sobre o qual eu escrevo, executo e evoluo testes como faria em um time de produto de verdade.

> 💡 **Projeto vivo:** este repositório é atualizado continuamente. A cada novo módulo estudado, novos cenários, padrões de projeto e boas práticas são incorporados — e o código existente é refatorado para refletir o que aprendi.

### 🎯 Objetivos

- Dominar o **Playwright Test Runner** com **TypeScript** em modo `strict`.
- Construir testes **confiáveis, legíveis e de fácil manutenção**.
- Aplicar boas práticas de mercado: localizadores resilientes, isolamento de testes, massa de dados controlada e padrões como **Page Objects** e **Fixtures**.
- Validar a aplicação em **múltiplas camadas** (UI e API).
- Preparar a suíte para rodar em **pipelines de CI/CD**.

---

## 🧠 O que este projeto demonstra

| Competência | Como aparece aqui |
| --- | --- |
| **Automação E2E** | Testes de interface com Playwright interagindo com uma aplicação real |
| **TypeScript** | Tipagem estrita (`strict: true`) em toda a suíte de testes |
| **Arquitetura de testes** | Separação clara entre aplicações sob teste (`apps/`) e a suíte (`tests/`) |
| **Configuração profissional** | `playwright.config.ts` com execução paralela, retries em CI, `forbidOnly` e trace viewer |
| **Ambiente local completo** | API + Web + banco de dados rodando lado a lado para testes realistas |
| **Debug e investigação** | Uso do **UI Mode** e do **Trace Viewer** para analisar falhas |
| **Pensamento de QA** | Foco em cenários de negócio, validações e prevenção de regressões |
| **Aprendizado contínuo** | Histórico de commits mostrando a evolução incremental do código |

---

## 🛠️ Stack tecnológica

### Suíte de testes
- **[Playwright Test](https://playwright.dev/)** `^1.63` — framework de automação E2E
- **[TypeScript](https://www.typescriptlang.org/)** — linguagem da suíte, em modo estrito
- **[Node.js](https://nodejs.org/)** `22` — runtime (versão fixada em `.node-version`)

### Aplicação sob teste (Mark L)
- **API:** Node.js · Express · TypeORM · SQLite (`better-sqlite3`) · Yup · UUID
- **Web:** SPA compilada servida via `http-server`

---

## 🗂️ Estrutura do repositório

```text
QAx-playwright-express/
└── playwright-mark/
    ├── apps/                     # Aplicações sob teste (Mark L)
    │   ├── api/                  # API REST — Express + TypeORM + SQLite (porta 3333)
    │   │   ├── src/
    │   │   │   ├── controllers/  # Regras de entrada das rotas
    │   │   │   ├── database/     # Conexão, migrations e banco SQLite
    │   │   │   ├── errors/       # Tratamento de erros da aplicação
    │   │   │   ├── models/       # Entidades (Task)
    │   │   │   ├── repositories/ # Acesso a dados
    │   │   │   ├── routes.js     # Definição dos endpoints
    │   │   │   └── server.js     # Bootstrap do servidor
    │   │   └── ormconfig.json
    │   └── web/                  # Front-end do gerenciador de tarefas (porta 8080)
    │
    ├── tests/                    # 🎭 Suíte de testes Playwright
    │   ├── home.spec.ts          # Smoke test da home
    │   └── tasks.spec.ts         # Cenários de tarefas
    │
    ├── playwright.config.ts      # Configuração do Playwright
    ├── tsconfig.json             # Configuração do TypeScript
    ├── .node-version             # Versão do Node.js utilizada
    └── package.json
```

---

## 🌐 Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `GET` | `/tasks` | Lista as tarefas |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa (ex.: marcar como concluída) |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |
| `DELETE` | `/helper/tasks` | 🧪 *Helper de testes* — remove tarefa(s) por nome |
| `DELETE` | `/helper/tasks/:task_name` | 🧪 *Helper de testes* — remove tarefa pelo nome na URL |

> ⚠️ As rotas `/helper/*` existem **apenas fora do ambiente de produção** (`NODE_ENV !== 'production'`) e servem para **preparar e limpar a massa de dados** antes/depois dos testes — uma prática essencial para garantir testes independentes e repetíveis.

**Modelo `Task`:** `id` (UUID) · `name` (string) · `is_done` (boolean) · `created_at` (data)

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js 22](https://nodejs.org/) (ou gerenciador como `fnm`/`nvm` lendo o `.node-version`)
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/DouglasAntoni0/QAx-Playwright.git
cd QAx-Playwright/playwright-mark
```

### 2. Subir a API (terminal 1)

```bash
cd apps/api
npm install
npm run db:init   # opcional: executa as migrations caso precise recriar o banco
npm run dev       # http://localhost:3333
```

### 3. Subir o front-end (terminal 2)

```bash
cd apps/web
npm install
npm run dev       # http://localhost:8080
```

### 4. Instalar e executar os testes (terminal 3)

```bash
# na pasta playwright-mark/
npm install
npx playwright install chromium

npm test          # execução headless
npm run test:ui   # modo interativo (UI Mode) — ótimo para debug
```

### 5. Ver o relatório

```bash
npx playwright show-report
```

---

## 🧪 Cenários de teste

| # | Funcionalidade | Cenário | Status |
| --- | --- | --- | --- |
| 1 | Home | Web app deve estar online (valida o título da página) | ✅ Implementado |
| 2 | Cadastro de tarefas | Deve cadastrar uma nova tarefa | 🚧 Em andamento |
| 3 | Cadastro de tarefas | Não deve permitir tarefa duplicada | 🔜 Em breve |
| 4 | Cadastro de tarefas | Campo obrigatório | 🔜 Em breve |
| 5 | Atualização | Deve concluir uma tarefa | 🔜 Em breve |
| 6 | Exclusão | Deve excluir uma tarefa | 🔜 Em breve |

```ts
// tests/home.spec.ts
import { test, expect } from '@playwright/test';

test('webapp deve estar online', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L');
});
```

---

## ⚙️ Destaques da configuração

O arquivo [`playwright.config.ts`](playwright-mark/playwright.config.ts) já está preparado para cenários reais de pipeline:

- **`fullyParallel: true`** — testes executam em paralelo, reduzindo o tempo total.
- **`forbidOnly: !!process.env.CI`** — impede que um `test.only` esquecido quebre a cobertura no CI.
- **`retries`** — 2 tentativas automáticas no CI para mitigar instabilidades de ambiente.
- **`trace: 'on-first-retry'`** — gera um *trace* completo (DOM, rede, console, screenshots) quando um teste falha, facilitando a análise da causa raiz.
- **Reporter HTML** — relatório visual e navegável dos resultados.

---

## 🗺️ Roadmap

- [x] Setup do projeto com Playwright + TypeScript
- [x] Ambiente local com API, Web e banco de dados
- [x] Primeiro teste E2E (smoke test da home)
- [ ] Cenários de cadastro, conclusão e exclusão de tarefas
- [ ] Testes de API com o `request` context do Playwright
- [ ] Massa de dados controlada via helpers da API
- [ ] Padrão **Page Object Model** / **Fixtures** customizadas
- [ ] `baseURL` e variáveis de ambiente (`.env`)
- [ ] Execução em múltiplos navegadores (Chromium, Firefox, WebKit)
- [ ] Pipeline de **CI com GitHub Actions** e publicação do relatório
- [ ] Dados dinâmicos com Faker

---

## 📚 Referência de estudo

Projeto desenvolvido a partir dos estudos do curso **[Playwright Express](https://www.udemy.com/course/playwright-express/)** (Udemy), do instrutor **Fernando Papito** (QAx). A aplicação **Mark L** utilizada como sistema sob teste é material do curso; a suíte de testes, a organização do repositório e as evoluções são de minha autoria e refletem o meu aprendizado prático.

---

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DouglasAntoni0">
        <img src="https://github.com/DouglasAntoni0.png" width="110px;" alt="Foto de Douglas Antonio"/><br>
        <sub><b>Douglas Antonio</b></sub>
      </a>
    </td>
    <td>
      Profissional apaixonado por <b>Qualidade de Software</b> e <b>Automação de Testes</b>.<br>
      Acredito que qualidade não é uma etapa — é parte da cultura de desenvolvimento.<br>
      Estou constantemente estudando e aplicando ferramentas modernas como o Playwright para entregar
      software mais confiável, com feedback rápido e menos regressões.<br><br>
      📫 <a href="mailto:douglas.doug1235@gmail.com">douglas.doug1235@gmail.com</a> ·
      🐙 <a href="https://github.com/DouglasAntoni0">github.com/DouglasAntoni0</a>
    </td>
  </tr>
</table>

---

<div align="center">

⭐ Se este projeto te ajudou ou chamou sua atenção, deixe uma estrela!

*Feito com 💚 e muitos testes por Douglas Antonio*

</div>
