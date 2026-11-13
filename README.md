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


## 📄 Licença

Este projeto está protegido sob os termos da licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

A licença MIT assegura os direitos autorais e de autoria do criador, isenta responsabilidade sobre uso indevido e permite que a comunidade utilize o software com segurança jurídica.

---

## 👤 Autor

Desenvolvido por **Alysson Pinheiro**  
- **LinkedIn**: [alyssonpinheiro](https://www.linkedin.com/in/alyssonpinheiro/)  
- **Cargo**: Analista de Dados  

