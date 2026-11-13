/**
 * DJ Carga - Lógica de Dimensionamento Elétrico e PWA
 * Versão 1.1.0 - Tratamento Avançado de Limites Aéreo e Subterrâneo
 * Autor: Alysson Pinheiro
 */

// Tabela de regras normativas
const REGRAS = [
  { rede: 'aerea', ligacao: 'monofasica', min: 0, max: 5.0, disjuntor: 20, cu: '4+4 mm²', al: '6+6 mm²', int: '0 < C ≤ 5,0' },
  { rede: 'aerea', ligacao: 'monofasica', min: 5.0, max: 8.0, disjuntor: 32, cu: '4+4 mm²', al: '6+6 mm²', int: '5,1 < C ≤ 8,0' },
  { rede: 'aerea', ligacao: 'monofasica', min: 8.0, max: 10.0, disjuntor: 40, cu: '6+6 mm²', al: '10+10 mm²', int: '8,1 < C ≤ 10,0' },
  { rede: 'aerea', ligacao: 'bifasica', min: 10.0, max: 20.0, disjuntor: 50, cu: '2x10+10 mm²', al: '2x16+16 mm²', int: '10,1 < C ≤ 20,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 10.0, max: 19.0, disjuntor: 25, cu: '3x6+6 mm²', al: '3x6+6 mm²', int: '10,1 < C ≤ 19,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 19.0, max: 21.0, disjuntor: 32, cu: '3x6+6 mm²', al: '3x10+10 mm²', int: '19,1 < C ≤ 21,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 21.0, max: 30.0, disjuntor: 40, cu: '3x10+10 mm²', al: '3x16+16 mm²', int: '21,1 < C ≤ 30,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 30.0, max: 37.0, disjuntor: 50, cu: '3x16+16 mm²', al: '3x25+25 mm²', int: '30,1 < C ≤ 37,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 37.0, max: 47.0, disjuntor: 63, cu: '3x16+16 mm²', al: '3x25+25 mm²', int: '37,1 < C ≤ 47,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 47.0, max: 60.0, disjuntor: 80, cu: '3x35+54,5 mm²', al: '3x50+50 mm²', int: '47,1 < C ≤ 60,0' },
  { rede: 'aerea', ligacao: 'trifasica', min: 60.0, max: 75.0, disjuntor: 100, cu: '3x35+54,5 mm²', al: '3x50+50 mm²', int: '60,1 < C ≤ 75,0' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 0, max: 5.0, disjuntor: 20, cu: '10 mm²', al: '25 mm²', int: '0 < C ≤ 5,0' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 5.0, max: 8.0, disjuntor: 32, cu: '10 mm²', al: '25 mm²', int: '5,1 < C ≤ 8,0' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 8.0, max: 10.0, disjuntor: 40, cu: '10 mm²', al: '25 mm²', int: '8,1 < C ≤ 10,0' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 10.0, max: 12.5, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '10,1 < C ≤ 12,5' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 12.5, max: 16.0, disjuntor: 63, cu: '16 mm²', al: '25 mm²', int: '12,51 < C ≤ 16,0' },
  { rede: 'subterranea', ligacao: 'bifasica', min: 16.0, max: 20.0, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '16,1 < C ≤ 20,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 16.0, max: 19.0, disjuntor: 25, cu: '16 mm²', al: '25 mm²', int: '16,1 < C ≤ 19,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 19.0, max: 21.0, disjuntor: 32, cu: '16 mm²', al: '25 mm²', int: '19,1 < C ≤ 21,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 21.0, max: 30.0, disjuntor: 40, cu: '16 mm²', al: '25 mm²', int: '21,1 < C ≤ 30,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 30.0, max: 37.0, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '30,1 < C ≤ 37,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 37.0, max: 47.0, disjuntor: 63, cu: '16 mm²', al: '25 mm²', int: '37,1 < C ≤ 47,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 47.0, max: 60.0, disjuntor: 80, cu: '25 mm²', al: '35 mm²', int: '47,1 < C ≤ 60,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 60.0, max: 75.0, disjuntor: 100, cu: '25 mm²', al: '50 mm²', int: '60,1 < C ≤ 75,0' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 75.0, max: 100.0, disjuntor: 125, cu: '50 mm²', al: '70 mm²', int: '75,1 < C ≤ 100,0' }
];

// Metadados normativos de limites e disjuntores por categoria
const LIMITES_NORMATIVOS = {
  aerea: {
    monofasica: { min: 0, max: 10.0, label: '0 < C ≤ 10,0 kW', disjuntores: [20, 32, 40] },
    bifasica: { min: 10.0, max: 20.0, label: '10,1 < C ≤ 20,0 kW', disjuntores: [50] },
    trifasica: { min: 10.0, max: 75.0, label: '10,1 < C ≤ 75,0 kW', disjuntores: [25, 32, 40, 50, 63, 80, 100] }
  },
  subterranea: {
    monofasica: { min: 0, max: 16.0, label: '0 < C ≤ 16,0 kW', disjuntores: [20, 32, 40, 50, 63] },
    bifasica: { min: 16.0, max: 20.0, label: '16,1 < C ≤ 20,0 kW', disjuntores: [50] },
    trifasica: { min: 16.0, max: 100.0, label: '16,1 < C ≤ 100,0 kW', disjuntores: [25, 32, 40, 50, 63, 80, 100, 125] }
  }
};

// Helper para converter texto numérico com vírgula ou ponto
function parseInput(val) {
  if (!val) return NaN;
  return parseFloat(val.toString().replace(',', '.'));
}

// Navegação entre abas
function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  const targetBtn = document.querySelector(`.tab-button[data-target="${tabId}"]`);

  if (targetTab) targetTab.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');
}

// Atualiza o indicador dinâmico de limites da Aba 1
function atualizarBadgeLimites1() {
  const rede = document.getElementById('rede1')?.value;
  const ligacao = document.getElementById('ligacao1')?.value;
  const badgeText = document.getElementById('limitText1');

  if (rede && ligacao && LIMITES_NORMATIVOS[rede]?.[ligacao] && badgeText) {
    badgeText.innerText = LIMITES_NORMATIVOS[rede][ligacao].label;
  }
}

// Atualiza o indicador dinâmico de disjuntores da Aba 2
function atualizarBadgeLimites2() {
  const rede = document.getElementById('rede2')?.value;
  const ligacao = document.getElementById('ligacao2')?.value;
  const badgeText = document.getElementById('limitText2');

  if (rede && ligacao && LIMITES_NORMATIVOS[rede]?.[ligacao] && badgeText) {
    const lista = LIMITES_NORMATIVOS[rede][ligacao].disjuntores.map(d => `${d}A`).join(', ');
    badgeText.innerText = lista;
  }
}

// Conversor Watts para kW
function converterWattsParaKw() {
  const inputWatts = document.getElementById('cargaW');
  const inputKw = document.getElementById('cargaKw');
  const w = inputWatts ? inputWatts.value.trim() : '';

  if (w && !isNaN(w)) {
    const kwValue = (parseFloat(w) / 1000).toFixed(2).replace('.00', '');
    if (inputKw) {
      inputKw.value = kwValue;
    }
    calcularAba1();
  } else {
    if (inputKw) inputKw.value = '';
    resetarBox1();
  }
}

// Reset do card de resultado da Aba 1
function resetarBox1() {
  const box = document.getElementById('resultadoBox1');
  const mainRes = document.getElementById('mainRes1');
  const subRes = document.getElementById('subRes1');
  const errorDetail = document.getElementById('errorDetail1');

  if (box) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Disjuntor Recomendado';
  }
  if (mainRes) {
    mainRes.innerText = '---';
    mainRes.style.fontSize = '2.2rem';
  }
  if (errorDetail) {
    errorDetail.style.display = 'none';
    errorDetail.innerText = '';
  }
  if (subRes) {
    subRes.style.display = 'none';
  }
}

// Cálculo da Aba 1 (Descobrir Disjuntor com Tratamento Avançado de Limites)
function calcularAba1() {
  const cargaVal = document.getElementById('cargaKw')?.value;
  const carga = parseInput(cargaVal);
  const rede = document.getElementById('rede1')?.value;
  const ligacao = document.getElementById('ligacao1')?.value;

  const box = document.getElementById('resultadoBox1');
  const mainRes = document.getElementById('mainRes1');
  const subRes = document.getElementById('subRes1');
  const errorDetail = document.getElementById('errorDetail1');
  const caboCu1 = document.getElementById('caboCu1');
  const caboAl1 = document.getElementById('caboAl1');

  if (!box || !mainRes || !subRes) return;

  if (isNaN(carga) || carga <= 0) {
    resetarBox1();
    return;
  }

  const regra = REGRAS.find(r => r.rede === rede && r.ligacao === ligacao && carga > r.min && carga <= r.max);

  if (regra) {
    // Caso de sucesso dentro da faixa normativa
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Disjuntor Recomendado (A)';
    mainRes.innerText = `${regra.disjuntor} A`;
    mainRes.style.fontSize = '2.2rem';
    if (errorDetail) {
      errorDetail.style.display = 'none';
      errorDetail.innerText = '';
    }
    if (caboCu1) caboCu1.innerText = regra.cu;
    if (caboAl1) caboAl1.innerText = regra.al;
    subRes.style.display = 'flex';
  } else {
    // Tratamento especializado e educativo dos limites
    box.classList.add('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Fora do Limite Normativo';
    subRes.style.display = 'none';

    let mensagemPrincipal = 'Limite Não Atendido';
    let detalheOrientacao = '';

    const cargaFormatada = carga.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

    // 1. Cargas acima do teto de Baixa Tensão (100 kW)
    if (carga > 100.0) {
      mensagemPrincipal = 'Carga Excede Baixa Tensão (> 100 kW)';
      detalheOrientacao = `A carga calculada (${cargaFormatada} kW) ultrapassa o limite máximo normativo para fornecimento em Baixa Tensão (100 kW). É obrigatório atendimento em Média Tensão (13,8 kV) com Subestação / Posto de Transformação dedicado.`;
    }
    // 2. Cargas entre 75 kW e 100 kW em rede Aérea
    else if (rede === 'aerea' && carga > 75.0 && carga <= 100.0) {
      mensagemPrincipal = 'Limite Máximo Aéreo Ultrapassado (75 kW)';
      detalheOrientacao = `A rede Aérea suporta no máximo 75 kW. Para cargas de ${cargaFormatada} kW, altere o Tipo de Rede para "Subterrânea" (atende até 100 kW com ligação Trifásica).`;
    }
    // 3. Limite Monofásico Aéreo (> 10 kW)
    else if (rede === 'aerea' && ligacao === 'monofasica' && carga > 10.0) {
      mensagemPrincipal = 'Máx: 10 kW na Aérea Monofásica';
      if (carga <= 20.0) {
        detalheOrientacao = `A carga de ${cargaFormatada} kW excede o limite monofásico aéreo (10 kW). Recomendação: altere a ligação para "Bifásica" (atende de 10 a 20 kW) ou "Trifásica".`;
      } else {
        detalheOrientacao = `A carga de ${cargaFormatada} kW excede os limites mono e bifásicos. Recomendação: altere a ligação para "Trifásica" (atende até 75 kW).`;
      }
    }
    // 4. Limite Monofásico Subterrâneo (> 16 kW)
    else if (rede === 'subterranea' && ligacao === 'monofasica' && carga > 16.0) {
      mensagemPrincipal = 'Máx: 16 kW na Subterrânea Monofásica';
      if (carga <= 20.0) {
        detalheOrientacao = `Na rede subterrânea, o limite monofásico é de 16 kW. Para ${cargaFormatada} kW, altere a ligação para "Bifásica" (atende de 16 a 20 kW) ou "Trifásica".`;
      } else {
        detalheOrientacao = `A carga de ${cargaFormatada} kW ultrapassa o limite monofásico (16 kW). Recomendação: altere para "Trifásica" (atende até 100 kW).`;
      }
    }
    // 5. Limites de ligação Bifásica
    else if (ligacao === 'bifasica') {
      const minBifasica = rede === 'aerea' ? 10.0 : 16.0;
      if (carga <= minBifasica) {
        mensagemPrincipal = `Carga Abaixo do Mínimo Bifásico (${minBifasica} kW)`;
        detalheOrientacao = `Para potências até ${minBifasica} kW em rede ${rede}, a norma padroniza o fornecimento através de ligação "Monofásica".`;
      } else if (carga > 20.0) {
        mensagemPrincipal = 'Máx: 20 kW na Ligação Bifásica';
        const tetoRede = rede === 'aerea' ? '75 kW' : '100 kW';
        detalheOrientacao = `O limite normativo da ligação bifásica é 20 kW. Para ${cargaFormatada} kW, migre para ligação "Trifásica" (atende até ${tetoRede} em rede ${rede}).`;
      }
    }
    // 6. Limites de ligação Trifásica
    else if (ligacao === 'trifasica') {
      const minTrifasica = rede === 'aerea' ? 10.0 : 16.0;
      if (carga <= minTrifasica) {
        mensagemPrincipal = `Carga Baixa p/ Trifásica (Mín: ${minTrifasica} kW)`;
        detalheOrientacao = `Para potências até ${minTrifasica} kW em rede ${rede}, a concessionária padroniza ligação "Monofásica" por economia e equilíbrio de carga.`;
      }
    }

    mainRes.innerText = mensagemPrincipal;
    mainRes.style.fontSize = '1.3rem';

    if (errorDetail) {
      errorDetail.innerText = detalheOrientacao;
      errorDetail.style.display = 'block';
    }
  }
}

// Cálculo da Aba 2 (Descobrir Carga com Tratamento Avançado de Limites)
function calcularAba2() {
  const disjuntorVal = document.getElementById('disjuntorA')?.value;
  const disjuntor = parseInt(disjuntorVal, 10);
  const rede = document.getElementById('rede2')?.value;
  const ligacao = document.getElementById('ligacao2')?.value;

  const box = document.getElementById('resultadoBox2');
  const mainRes = document.getElementById('mainRes2');
  const subRes = document.getElementById('subRes2');
  const errorDetail = document.getElementById('errorDetail2');
  const caboCu2 = document.getElementById('caboCu2');
  const caboAl2 = document.getElementById('caboAl2');

  if (!box || !mainRes || !subRes) return;

  if (isNaN(disjuntor) || disjuntor <= 0) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Intervalo de Carga (kW)';
    mainRes.innerText = '---';
    mainRes.style.fontSize = '2.2rem';
    if (errorDetail) {
      errorDetail.style.display = 'none';
      errorDetail.innerText = '';
    }
    subRes.style.display = 'none';
    return;
  }

  const regra = REGRAS.find(r => r.rede === rede && r.ligacao === ligacao && r.disjuntor === disjuntor);

  if (regra) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Carga Suportada (kW)';
    mainRes.innerText = regra.int;
    mainRes.style.fontSize = '2.2rem';
    if (errorDetail) {
      errorDetail.style.display = 'none';
      errorDetail.innerText = '';
    }
    if (caboCu2) caboCu2.innerText = regra.cu;
    if (caboAl2) caboAl2.innerText = regra.al;
    subRes.style.display = 'flex';
  } else {
    box.classList.add('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Disjuntor Fora do Padrão';
    subRes.style.display = 'none';

    let detalhe = '';
    const categoria = LIMITES_NORMATIVOS[rede]?.[ligacao];
    const listaDisjuntores = categoria ? categoria.disjuntores.map(d => `${d}A`).join(', ') : '';

    if (disjuntor === 125 && rede === 'aerea') {
      mainRes.innerText = 'Disjuntor 125A Não Permitido em Rede Aérea';
      detalhe = 'O disjuntor de 125A é exclusivo para Rede Subterrânea Trifásica (até 100 kW). Em rede aérea, o disjuntor máximo padronizado é 100A (75 kW).';
    } else if (disjuntor > 125) {
      mainRes.innerText = `Disjuntor ${disjuntor}A Excede Baixa Tensão`;
      detalhe = 'Disjuntores acima de 125A não são permitidos em padrão de entrada direta de baixa tensão. Exigem medição indireta (com TCs) ou atendimento em Média Tensão.';
    } else if (disjuntor > 100 && rede === 'aerea') {
      mainRes.innerText = `Disjuntor ${disjuntor}A Acima do Teto Aéreo`;
      detalhe = `O limite de disjuntor para rede aérea é de 100A. Para utilizar disjuntores maiores, altere para Rede Subterrânea.`;
    } else {
      mainRes.innerText = `Disjuntor ${disjuntor}A Incompatível`;
      detalhe = `Não há padrão normativo para ${disjuntor}A nesta combinação (${rede} ${ligacao}). Disjuntores homologados: ${listaDisjuntores}.`;
    }

    mainRes.style.fontSize = '1.3rem';
    if (errorDetail) {
      errorDetail.innerText = detalhe;
      errorDetail.style.display = 'block';
    }
  }
}

// Inicialização dos eventos do DOM
document.addEventListener('DOMContentLoaded', () => {
  // Configurar botões de abas
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) openTab(target);
    });
  });

  // Atualiza os badges iniciais
  atualizarBadgeLimites1();
  atualizarBadgeLimites2();

  // Inputs Aba 1
  const cargaW = document.getElementById('cargaW');
  if (cargaW) cargaW.addEventListener('input', converterWattsParaKw);

  const cargaKw = document.getElementById('cargaKw');
  if (cargaKw) cargaKw.addEventListener('input', calcularAba1);

  const rede1 = document.getElementById('rede1');
  if (rede1) {
    rede1.addEventListener('change', () => {
      atualizarBadgeLimites1();
      calcularAba1();
    });
  }

  const ligacao1 = document.getElementById('ligacao1');
  if (ligacao1) {
    ligacao1.addEventListener('change', () => {
      atualizarBadgeLimites1();
      calcularAba1();
    });
  }

  // Inputs Aba 2
  const disjuntorA = document.getElementById('disjuntorA');
  if (disjuntorA) disjuntorA.addEventListener('input', calcularAba2);

  const rede2 = document.getElementById('rede2');
  if (rede2) {
    rede2.addEventListener('change', () => {
      atualizarBadgeLimites2();
      calcularAba2();
    });
  }

  const ligacao2 = document.getElementById('ligacao2');
  if (ligacao2) {
    ligacao2.addEventListener('change', () => {
      atualizarBadgeLimites2();
      calcularAba2();
    });
  }

  // Gerenciamento de Instalação PWA
  let deferredPrompt = null;
  const modal = document.getElementById('installModal');
  const btnInstall = document.getElementById('btnInstall');
  const btnCancel = document.getElementById('btnCancelInstall');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (modal) modal.style.display = 'flex';
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (modal) modal.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
    });
  }

  if (btnCancel && modal) {
    btnCancel.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
});

// Registro do Service Worker para suporte Offline completo
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => {
        console.log('[DJ Carga] Service Worker v1.1.0 registrado com sucesso:', reg.scope);
      })
      .catch(err => {
        console.error('[DJ Carga] Falha ao registrar Service Worker:', err);
      });
  });
}
