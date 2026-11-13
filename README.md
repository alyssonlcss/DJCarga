# ⚡ DJ Carga - Dimensionamento Elétrico Inteligente

[![Licença: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel Status](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-success?logo=pwa)](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)
[![Versão](https://img.shields.io/badge/versão-1.0.0-informational.svg)](https://github.com/alyssonlcss/DJCarga)

O **DJ Carga** é uma aplicação web progressiva (PWA) desenvolvida para eletricistas, engenheiros, técnicos e projetistas realizarem o dimensionamento rápido, normativo e preciso de disjuntores de entrada e condutores (cobre e alumínio) conforme os limites de carga em redes aéreas e subterrâneas.

Construído sob a filosofia **Offline-First**, o aplicativo funciona sem conexão à internet em qualquer smartphone, tablet ou computador após o primeiro acesso ou instalação na tela inicial.

---

## 🚀 Funcionalidades Principais

- 🔌 **Descobrir Disjuntor por Carga (kW ou W)**:
  - Informe a potência em kW ou use o conversor rápido de Watts para kW.
  - Selecione o tipo de rede (**Aérea** ou **Subterrânea**) e tipo de ligação (**Monofásica**, **Bifásica** ou **Trifásica**).
  - Obtenha instantaneamente o disjuntor recomendado (A) e as bitolas normativas para condutores de **Cobre (Cu)** e **Alumínio (AL)**.
  - Alertas automáticos caso a potência ultrapasse o limite normativo para a ligação escolhida.

- ⚡ **Descobrir Carga por Disjuntor**:
  - Informe a corrente nominal do disjuntor (A).
  - Consulte a faixa de carga permitida e os cabos correspondentes para a configuração selecionada.

- 📱 **PWA e Suporte 100% Offline**:
  - Service Worker integrado com cache inteligente (`sw.js`).
  - Instalável como aplicativo nativo no Android, iOS e Desktop (botão "Adicionar à Tela Inicial").
  - Carregamento instantâneo mesmo em locais remotos ou em campo sem sinal de internet.

---

## 📂 Arquitetura do Projeto

O projeto foi estruturado seguindo as melhores práticas de desenvolvimento web moderno com separação estrita de responsabilidades:

```text
DJCarga/
├── index.html        # Estrutura semântica e visual (HTML limpo)
├── style.css         # Identidade visual, design responsivo e estilos
├── app.js            # Lógica de cálculo, regras normativas e eventos da UI
├── sw.js             # Service Worker para cache e funcionamento offline
├── manifest.json     # Metadados e configuração para PWA instalável
├── icon.svg          # Ícone em vetor escalável para o app e PWA
├── vercel.json       # Configurações de headers e cache para o deploy na Vercel
├── LICENSE           # Licença MIT protegendo o código e a autoria
└── README.md         # Documentação completa do projeto
```

---

## 📊 Tabela de Padrões e Regras Normativas

O algoritmo utiliza uma base de regras para dimensionamento:

### 1. Rede Aérea
| Ligação | Faixa de Potência (kW) | Disjuntor (A) | Cabo Cobre (Cu) | Cabo Alumínio (AL) |
|---|---|:---:|:---:|:---:|
| Monofásica | 0 a 5,0 kW | 20 A | 4+4 mm² | 6+6 mm² |
| Monofásica | 5,1 a 8,0 kW | 32 A | 4+4 mm² | 6+6 mm² |
| Monofásica | 8,1 a 10,0 kW | 40 A | 6+6 mm² | 10+10 mm² |
| Bifásica | 10,1 a 20,0 kW | 50 A | 2x10+10 mm² | 2x16+16 mm² |
| Trifásica | 10,1 a 19,0 kW | 25 A | 3x6+6 mm² | 3x6+6 mm² |
| Trifásica | 19,1 a 21,0 kW | 32 A | 3x6+6 mm² | 3x10+10 mm² |
| Trifásica | 21,1 a 30,0 kW | 40 A | 3x10+10 mm² | 3x16+16 mm² |
| Trifásica | 30,1 a 37,0 kW | 50 A | 3x16+16 mm² | 3x25+25 mm² |
| Trifásica | 37,1 a 47,0 kW | 63 A | 3x16+16 mm² | 3x25+25 mm² |
| Trifásica | 47,1 a 60,0 kW | 80 A | 3x35+54,5 mm² | 3x50+50 mm² |
| Trifásica | 60,1 a 75,0 kW | 100 A | 3x35+54,5 mm² | 3x50+50 mm² |

### 2. Rede Subterrânea
| Ligação | Faixa de Potência (kW) | Disjuntor (A) | Cabo Cobre (Cu) | Cabo Alumínio (AL) |
|---|---|:---:|:---:|:---:|
| Monofásica | 0 a 5,0 kW | 20 A | 10 mm² | 25 mm² |
| Monofásica | 5,1 a 8,0 kW | 32 A | 10 mm² | 25 mm² |
| Monofásica | 8,1 a 10,0 kW | 40 A | 10 mm² | 25 mm² |
| Monofásica | 10,1 a 12,5 kW | 50 A | 16 mm² | 25 mm² |
| Monofásica | 12,51 a 16,0 kW | 63 A | 16 mm² | 25 mm² |
| Bifásica | 16,1 a 20,0 kW | 50 A | 16 mm² | 25 mm² |
| Trifásica | 16,1 a 19,0 kW | 25 A | 16 mm² | 25 mm² |
| Trifásica | 19,1 a 21,0 kW | 32 A | 16 mm² | 25 mm² |
| Trifásica | 21,1 a 30,0 kW | 40 A | 16 mm² | 25 mm² |
| Trifásica | 30,1 a 37,0 kW | 50 A | 16 mm² | 25 mm² |
| Trifásica | 37,1 a 47,0 kW | 63 A | 16 mm² | 25 mm² |
| Trifásica | 47,1 a 60,0 kW | 80 A | 25 mm² | 35 mm² |
| Trifásica | 60,1 a 75,0 kW | 100 A | 25 mm² | 50 mm² |
| Trifásica | 75,1 a 100,0 kW | 125 A | 50 mm² | 70 mm² |

---

## 🛠️ Como Executar Localmente

Como o projeto é composto por arquivos estáticos puros, não é necessária nenhuma etapa de build:

1. Clone o repositório:
   ```bash
   git clone https://github.com/alyssonlcss/DJCarga.git
   cd DJCarga
   ```

2. Abra através de um servidor local (necessário para o funcionamento do Service Worker):
   - **Com Python 3**:
     ```bash
     python -m http.server 8000
     ```
   - **Com Node.js (npx serve)**:
     ```bash
     npx serve .
     ```
   - **Com a extensão Live Server** no VS Code:
     Basta clicar com o botão direito no `index.html` e selecionar *"Open with Live Server"*.

3. Acesse `http://localhost:8000` no navegador.

---

## 🌐 Como Fazer o Deploy no Vercel

O Vercel é ideal para hospedar este projeto por oferecer HTTPS nativo gratuito (obrigatório para Service Workers e PWA).

### Opção 1: Via Painel Web da Vercel (Recomendado)

1. Acesse o site oficial: [vercel.com](https://vercel.com) e faça login (pode usar sua conta do GitHub).
2. No dashboard, clique no botão **"Add New..."** e selecione **"Project"**.
3. Na lista de repositórios do GitHub, localize e clique em **"Import"** ao lado de `DJCarga`.
4. Na tela de configuração:
   - **Framework Preset**: Deixe como `Other` (pois é um site estático puro).
   - **Root Directory**: `./` (padrão).
   - **Build and Output Settings**: Não precisa alterar nada.
5. Clique no botão **"Deploy"**.
6. Em poucos segundos o seu site estará publicado em uma URL como `https://djcarga.vercel.app`.

> **Vantagem desta opção:** Sempre que você fizer um `git push` para o GitHub, a Vercel atualizará a versão online automaticamente!

---

### Opção 2: Via Terminal usando Vercel CLI

1. Instale a ferramenta de linha de comando da Vercel globalmente:
   ```bash
   npm i -g vercel
   ```

2. Dentro da pasta do projeto (`c:\Users\BR0083895903\source\DJCarga`), execute:
   ```bash
   vercel
   ```

3. Responda às perguntas no terminal:
   - *Set up and deploy?* **Y** (Sim)
   - *Which scope?* Selecione seu usuário.
   - *Link to existing project?* **N**
   - *What's your project's name?* **djcarga**
   - *In which directory is your code located?* **./**
4. Para publicar direto em produção:
   ```bash
   vercel --prod
   ```

---

## 📄 Licença

Este projeto está protegido sob os termos da licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

A licença MIT assegura os direitos autorais e de autoria do criador, isenta responsabilidade sobre uso indevido e permite que a comunidade utilize o software com segurança jurídica.

---

## 👤 Autor

Desenvolvido por **Alysson Pinheiro**  
- **LinkedIn**: [alyssonpinheiro](https://www.linkedin.com/in/alyssonpinheiro/)  
- **Cargo**: Analista de Dados  

