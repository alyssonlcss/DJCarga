# ⚡ DJ Carga - Dimensionamento Elétrico Inteligente

[![Licença: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel Status](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-success?logo=pwa)](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)
[![Versão](https://img.shields.io/badge/versão-1.1.0-informational.svg)](https://github.com/alyssonlcss/DJCarga)

O **DJ Carga** é uma aplicação web progressiva (PWA) desenvolvida para eletricistas, engenheiros, técnicos e projetistas realizarem o dimensionamento rápido, normativo e preciso de disjuntores de entrada e condutores (cobre e alumínio) conforme os limites de carga em redes aéreas e subterrâneas.

Construído sob a filosofia **Offline-First**, o aplicativo funciona sem conexão à internet em qualquer smartphone, tablet ou computador após o primeiro acesso ou instalação na tela inicial.

---

## 🚀 Funcionalidades Principais

- 🔌 **Descobrir Disjuntor por Carga (kW ou W)**:
  - Informe a potência em kW ou use o conversor rápido de Watts para kW.
  - Selecione o tipo de rede (**Aérea** ou **Subterrânea**) e tipo de ligação (**Monofásica**, **Bifásica** ou **Trifásica**).
  - Obtenha instantaneamente o disjuntor recomendado (A) e as bitolas normativas para condutores de **Cobre (Cu)** e **Alumínio (AL)**.
  - **Indicador Dinâmico de Faixa:** Exibe em tempo real o intervalo normativo permitido para a combinação selecionada.
  - **Tratamento Inteligente de Limites (v1.1.0):** Diagnóstico detalhado e educativo com recomendação automática de migração de ligação (ex: monofásico para bifásico/trifásico), migração de rede (aérea até 75 kW para subterrânea até 100 kW) ou indicação de atendimento obrigatório em Média Tensão para cargas > 100 kW.

- ⚡ **Descobrir Carga por Disjuntor**:
  - Informe a corrente nominal do disjuntor (A).
  - Consulte a faixa de carga permitida e os condutores correspondentes.
  - Validação de disjuntores homologados para a rede (alerta para disjuntores como 125A restritos a subterrânea, limites para medição indireta e lista de disjuntores padronizados).

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

## 📊 Tabelas de Referência Normativa (Enel CE)

O dimensionamento segue os padrões da norma **Enel Distribuição Ceará (220/380 V)**:

### 1. Rede Aérea (Anexo F)
| Tipo Fornecimento | Carga Instalada (kW) | Disjuntor (A) | Ramal AL (mm²) | Ramal Cu (mm²) | Aterramento Cu (mm²) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **A1** | 0 < C ≤ 5,0 | 20 A | 6+6 | 4+4 | 6 |
| **A2** | 5,0 < C ≤ 8,0 | 32 A | 6+6 | 4+4 | 6 |
| **A3** | 8,0 < C ≤ 10,0 | 40 A | 10+10 | 6+6 | 10 |
| **B1** | 10,0 < C ≤ 20,0 | 50 A | 2x16+16 | 2x10+10 | 16 |
| **C1** | 10,0 < C ≤ 19,0 | 25 A | 3x6+6 | 3x6+6 | 16 |
| **C2** | 19,0 < C ≤ 21,0 | 32 A | 3x10+10 | 3x6+6 | 16 |
| **C3** | 21,0 < C ≤ 30,0 | 40 A | 3x16+16 | 3x10+10 | 16 |
| **C4** | 30,0 < C ≤ 37,0 | 50 A | 3x25+25 | 3x16+16 | 16 |
| **C5** | 37,0 < C ≤ 47,0 | 63 A | 3x25+25 | 3x16+16 | 16 |
| **C6** | 47,0 < C ≤ 60,0 | 80 A | 3x50+50 | 3x35+35 | 16 |
| **C7** | 60,0 < C ≤ 75,0 | 100 A | 3x50+50 | 3x35+35 | 16 |

### 2. Rede Subterrânea (Anexo G)
| Tipo Fornecimento | Carga Instalada (kW) | Disjuntor (A) | Ramal AL (mm²) | Ramal Cu (mm²) |
|:---:|:---:|:---:|:---:|:---:|
| **A1** | 0 < C ≤ 5,0 | 20 A | 25 | 10 |
| **A2** | 5,0 < C ≤ 8,0 | 32 A | 25 | 10 |
| **A3** | 8,0 < C ≤ 10,0 | 40 A | 25 | 10 |
| **A4** | 10,0 < C ≤ 12,5 | 50 A | 25 | 16 |
| **A5** | 12,5 < C ≤ 16,0 | 63 A | 25 | 16 |
| **B1** | 10,0 < C ≤ 20,0 | 50 A | 25 | 16 |
| **C1** | 16,0 < C ≤ 19,0 | 25 A | 25 | 16 |
| **C2** | 19,0 < C ≤ 21,0 | 32 A | 25 | 16 |
| **C3** | 21,0 < C ≤ 30,0 | 40 A | 25 | 16 |
| **C4** | 30,0 < C ≤ 37,0 | 50 A | 25 | 16 |
| **C5** | 37,0 < C ≤ 47,0 | 63 A | 25 | 16 |
| **C6** | 47,0 < C ≤ 60,0 | 80 A | 35 | 25 |
| **C7** | 60,0 < C ≤ 75,0 | 100 A | 50 | 25 |
| **C8** | 75,0 < C ≤ 100,0 | 125 A | 3x70+70 | 3x50+50 |

### 3. Matriz de Sugestões Conforme Planilha da Concessionária
- **Rede Aérea:**
  - `0 < C ≤ 10,0 kW`: Aérea Monofásica (20A a 40A)
  - `10,0 < C ≤ 20,0 kW`: Aérea Bifásica (50A) ou Aérea Trifásica (25A)
  - `20,0 < C ≤ 75,0 kW`: Aérea Trifásica (32A a 100A)
- **Rede Subterrânea:**
  - `0 < C ≤ 16,0 kW`: Subterrânea Monofásica (20A a 63A)
  - `16,0 < C ≤ 20,0 kW`: Subterrânea Bifásica (50A) ou Subterrânea Trifásica (25A)
  - `20,0 < C ≤ 100,0 kW`: Subterrânea Trifásica (32A a 125A)

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

