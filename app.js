/**
 * DJ Carga - Lógica de Dimensionamento Elétrico e PWA
 * Versão 1.1.0 - Tratamento Avançado de Limites Aéreo e Subterrâneo
 * Autor: Alysson Pinheiro
 */

// Tabela de regras normativas
const REGRAS = [
  { rede: 'aerea', ligacao: 'monofasica', min: 0, max: 5.0, disjuntor: 20, cu: '4+4 mm²', al: '6+6 mm²', int: '0 < C ≤ 5,0 kW', watts: '0 < C ≤ 5.000 W' },
  { rede: 'aerea', ligacao: 'monofasica', min: 5.0, max: 8.0, disjuntor: 32, cu: '4+4 mm²', al: '6+6 mm²', int: '5,0 < C ≤ 8,0 kW', watts: '5.000 < C ≤ 8.000 W' },
  { rede: 'aerea', ligacao: 'monofasica', min: 8.0, max: 10.0, disjuntor: 40, cu: '6+6 mm²', al: '10+10 mm²', int: '8,0 < C ≤ 10,0 kW', watts: '8.000 < C ≤ 10.000 W' },
  { rede: 'aerea', ligacao: 'bifasica', min: 10.0, max: 20.0, disjuntor: 50, cu: '2x10+10 mm²', al: '2x16+16 mm²', int: '10,0 < C ≤ 20,0 kW', watts: '10.000 < C ≤ 20.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 10.0, max: 19.0, disjuntor: 25, cu: '3x6+6 mm²', al: '3x6+6 mm²', int: '10,0 < C ≤ 19,0 kW', watts: '10.000 < C ≤ 19.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 19.0, max: 21.0, disjuntor: 32, cu: '3x6+6 mm²', al: '3x10+10 mm²', int: '19,0 < C ≤ 21,0 kW', watts: '19.000 < C ≤ 21.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 21.0, max: 30.0, disjuntor: 40, cu: '3x10+10 mm²', al: '3x16+16 mm²', int: '21,0 < C ≤ 30,0 kW', watts: '21.000 < C ≤ 30.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 30.0, max: 37.0, disjuntor: 50, cu: '3x16+16 mm²', al: '3x25+25 mm²', int: '30,0 < C ≤ 37,0 kW', watts: '30.000 < C ≤ 37.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 37.0, max: 47.0, disjuntor: 63, cu: '3x16+16 mm²', al: '3x25+25 mm²', int: '37,0 < C ≤ 47,0 kW', watts: '37.000 < C ≤ 47.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 47.0, max: 60.0, disjuntor: 80, cu: '3x35+35 mm²', al: '3x50+50 mm²', int: '47,0 < C ≤ 60,0 kW', watts: '47.000 < C ≤ 60.000 W' },
  { rede: 'aerea', ligacao: 'trifasica', min: 60.0, max: 75.0, disjuntor: 100, cu: '3x35+35 mm²', al: '3x50+50 mm²', int: '60,0 < C ≤ 75,0 kW', watts: '60.000 < C ≤ 75.000 W' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 0, max: 5.0, disjuntor: 20, cu: '10 mm²', al: '25 mm²', int: '0 < C ≤ 5,0 kW', watts: '0 < C ≤ 5.000 W' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 5.0, max: 8.0, disjuntor: 32, cu: '10 mm²', al: '25 mm²', int: '5,0 < C ≤ 8,0 kW', watts: '5.000 < C ≤ 8.000 W' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 8.0, max: 10.0, disjuntor: 40, cu: '10 mm²', al: '25 mm²', int: '8,0 < C ≤ 10,0 kW', watts: '8.000 < C ≤ 10.000 W' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 10.0, max: 12.5, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '10,0 < C ≤ 12,5 kW', watts: '10.000 < C ≤ 12.500 W' },
  { rede: 'subterranea', ligacao: 'monofasica', min: 12.5, max: 16.0, disjuntor: 63, cu: '16 mm²', al: '25 mm²', int: '12,5 < C ≤ 16,0 kW', watts: '12.500 < C ≤ 16.000 W' },
  { rede: 'subterranea', ligacao: 'bifasica', min: 10.0, max: 20.0, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '10,0 < C ≤ 20,0 kW', watts: '10.000 < C ≤ 20.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 16.0, max: 19.0, disjuntor: 25, cu: '16 mm²', al: '25 mm²', int: '16,0 < C ≤ 19,0 kW', watts: '16.000 < C ≤ 19.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 19.0, max: 21.0, disjuntor: 32, cu: '16 mm²', al: '25 mm²', int: '19,0 < C ≤ 21,0 kW', watts: '19.000 < C ≤ 21.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 21.0, max: 30.0, disjuntor: 40, cu: '16 mm²', al: '25 mm²', int: '21,0 < C ≤ 30,0 kW', watts: '21.000 < C ≤ 30.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 30.0, max: 37.0, disjuntor: 50, cu: '16 mm²', al: '25 mm²', int: '30,0 < C ≤ 37,0 kW', watts: '30.000 < C ≤ 37.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 37.0, max: 47.0, disjuntor: 63, cu: '16 mm²', al: '25 mm²', int: '37,0 < C ≤ 47,0 kW', watts: '37.000 < C ≤ 47.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 47.0, max: 60.0, disjuntor: 80, cu: '25 mm²', al: '35 mm²', int: '47,0 < C ≤ 60,0 kW', watts: '47.000 < C ≤ 60.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 60.0, max: 75.0, disjuntor: 100, cu: '25 mm²', al: '50 mm²', int: '60,0 < C ≤ 75,0 kW', watts: '60.000 < C ≤ 75.000 W' },
  { rede: 'subterranea', ligacao: 'trifasica', min: 75.0, max: 100.0, disjuntor: 125, cu: '3x50+50 mm²', al: '3x70+70 mm²', int: '75,0 < C ≤ 100,0 kW', watts: '75.000 < C ≤ 100.000 W' }
];

// Metadados normativos de limites e disjuntores por categoria
const LIMITES_NORMATIVOS = {
  aerea: {
    monofasica: { min: 0, max: 10.0, label: '0 < C ≤ 10,0 kW', disjuntores: [20, 32, 40] },
    bifasica: { min: 10.0, max: 20.0, label: '10,0 < C ≤ 20,0 kW', disjuntores: [50] },
    trifasica: { min: 10.0, max: 75.0, label: '10,0 < C ≤ 75,0 kW', disjuntores: [25, 32, 40, 50, 63, 80, 100] }
  },
  subterranea: {
    monofasica: { min: 0, max: 16.0, label: '0 < C ≤ 16,0 kW', disjuntores: [20, 32, 40, 50, 63] },
    bifasica: { min: 10.0, max: 20.0, label: '10,0 < C ≤ 20,0 kW', disjuntores: [50] },
    trifasica: { min: 16.0, max: 100.0, label: '16,0 < C ≤ 100,0 kW', disjuntores: [25, 32, 40, 50, 63, 80, 100, 125] }
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

// Atualiza o limite dinâmico da opção selecionada na Aba 1
function atualizarBadgeLimites1() {
  const rede = document.getElementById('rede1')?.value || 'aerea';
  const ligacao = document.getElementById('ligacao1')?.value || 'monofasica';

  const nomeRede = rede === 'aerea' ? 'Aérea' : 'Subterrânea';
  const nomeLigacao = ligacao === 'monofasica' ? 'Monofásica' : (ligacao === 'bifasica' ? 'Bifásica' : 'Trifásica');

  const labelElem = document.getElementById('limitLabel1');
  if (labelElem) {
    labelElem.innerText = `⚡ ${nomeRede} ${nomeLigacao}:`;
  }

  const textElem = document.getElementById('limitText1');
  const limite = LIMITES_NORMATIVOS[rede]?.[ligacao];
  if (textElem && limite) {
    textElem.innerText = limite.label;
  }
}

// Atualiza os disjuntores dinâmicos da opção selecionada na Aba 2
function atualizarBadgeLimites2() {
  const rede = document.getElementById('rede2')?.value || 'aerea';
  const ligacao = document.getElementById('ligacao2')?.value || 'monofasica';

  const nomeRede = rede === 'aerea' ? 'Aérea' : 'Subterrânea';
  const nomeLigacao = ligacao === 'monofasica' ? 'Monofásica' : (ligacao === 'bifasica' ? 'Bifásica' : 'Trifásica');

  const labelElem = document.getElementById('limitLabel2');
  if (labelElem) {
    labelElem.innerText = `⚡ ${nomeRede} ${nomeLigacao}:`;
  }

  const textElem = document.getElementById('limitText2');
  const limite = LIMITES_NORMATIVOS[rede]?.[ligacao];
  if (textElem && limite) {
    textElem.innerText = limite.disjuntores.map(d => `${d}A`).join(', ');
  }
}

// Conversor Watts para kW (precisão de até 3 casas decimais: 1 kW = 1.000 W)
function converterWattsParaKw() {
  const inputWatts = document.getElementById('cargaW');
  const inputKw = document.getElementById('cargaKw');
  const w = inputWatts ? inputWatts.value.trim() : '';

  if (w && !isNaN(w)) {
    const valKw = parseFloat(w) / 1000;
    const kwValue = Number(valKw.toFixed(3)).toString().replace('.', ',');
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

    const cargaFormatada = carga.toLocaleString('pt-BR', { maximumFractionDigits: 3 });

    // 1. Cargas acima do teto de Baixa Tensão (100 kW)
    if (carga > 100.0) {
      mensagemPrincipal = 'Carga Excede Baixa Tensão (> 100 kW) • Requer Grupo A';
      detalheOrientacao = `A carga calculada (${cargaFormatada} kW) ultrapassa o limite normativo de fornecimento em Baixa Tensão (Grupo B). Este projeto requer solicitação de fornecimento no Grupo A (Média Tensão - 13,8 kV), com subestação / posto de transformação próprio e contratação de demanda.`;
    }
    // 2. Cargas entre 75 kW e 100 kW em rede Aérea
    else if (rede === 'aerea' && carga > 75.0 && carga <= 100.0) {
      mensagemPrincipal = 'Limite Aéreo Excedido (75 kW) • Requer Grupo A';
      detalheOrientacao = `O fornecimento em rede aérea de Baixa Tensão (Grupo B) é limitado a 75 kW. Para uma carga de ${cargaFormatada} kW, o procedimento padrão é solicitar atendimento no Grupo A (Média Tensão) junto à concessionária. Como alternativa, caso exista disponibilidade técnica de rede "Subterrânea" no local, você pode alterar o tipo de rede (atende até 100 kW em Baixa Tensão com disjuntor de 125A).`;
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
    // 5. Limites de ligação Bifásica (10,0 < C ≤ 20,0 kW em ambas as redes conforme Enel CE)
    else if (ligacao === 'bifasica') {
      if (carga <= 10.0) {
        mensagemPrincipal = 'Carga Abaixo do Mínimo Bifásico (10 kW)';
        detalheOrientacao = rede === 'aerea'
          ? `Para potências até 10 kW em rede aérea, a norma padroniza o fornecimento através de ligação "Monofásica".`
          : `Para potências até 10 kW (e até 16 kW) em rede subterrânea, a norma padroniza o fornecimento preferencial através de ligação "Monofásica".`;
      } else if (carga > 20.0) {
        mensagemPrincipal = 'Máx: 20 kW na Ligação Bifásica';
        const tetoRede = rede === 'aerea' ? '75 kW' : '100 kW';
        detalheOrientacao = `O limite normativo da ligação bifásica é 20 kW. Para ${cargaFormatada} kW, migre para ligação "Trifásica" (atende até ${tetoRede} em rede ${rede}).`;
      }
    }
    // 6. Limites de ligação Trifásica (Mínimo: 10 kW na Aérea / 16 kW na Subterrânea)
    else if (ligacao === 'trifasica') {
      const minTrifasica = rede === 'aerea' ? 10.0 : 16.0;
      if (carga <= minTrifasica) {
        mensagemPrincipal = `Carga Baixa p/ Trifásica (Mín: ${minTrifasica} kW)`;
        detalheOrientacao = rede === 'aerea'
          ? `Para potências até 10 kW em rede aérea, a concessionária padroniza ligação "Monofásica" por economia e equilíbrio de carga.`
          : `Para potências até 16 kW em rede subterrânea, a concessionária padroniza ligação "Monofásica" (atende até 63A).`;
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
  const subWatts = document.getElementById('subResWatts2');
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
    if (subWatts) {
      subWatts.style.display = 'none';
      subWatts.innerText = '';
    }
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
    if (title) title.innerText = 'Intervalo de Carga (kW)';
    mainRes.innerText = regra.int;
    mainRes.style.fontSize = '2.2rem';
    if (subWatts) {
      subWatts.innerText = `Equivalente a: ${regra.watts}`;
      subWatts.style.display = 'block';
    }
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
    if (subWatts) {
      subWatts.style.display = 'none';
      subWatts.innerText = '';
    }

    let detalhe = '';
    const categoria = LIMITES_NORMATIVOS[rede]?.[ligacao];
    const listaDisjuntores = categoria ? categoria.disjuntores.map(d => `${d}A`).join(', ') : '';

    if (disjuntor === 125 && rede === 'aerea') {
      mainRes.innerText = 'Disjuntor 125A Não Permitido em Rede Aérea';
      detalhe = 'O disjuntor de 125A é exclusivo para Rede Subterrânea Trifásica (até 100 kW). Em rede aérea, o disjuntor máximo padronizado é 100A (75 kW).';
    } else if (disjuntor > 125) {
      mainRes.innerText = `Disjuntor ${disjuntor}A Excede Baixa Tensão`;
      detalhe = 'Disjuntores acima de 125A não são permitidos em padrão de entrada direta de Baixa Tensão (Grupo B). Exigem medição indireta (com TCs) ou solicitação de fornecimento no Grupo A (Média Tensão).';
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
