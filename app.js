/**
 * DJ Carga - Lógica de Dimensionamento Elétrico e PWA
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

  if (box) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Disjuntor Recomendado';
  }
  if (mainRes) {
    mainRes.innerText = '---';
    mainRes.style.fontSize = '2.2rem';
  }
  if (subRes) {
    subRes.style.display = 'none';
  }
}

// Cálculo da Aba 1 (Descobrir Disjuntor)
function calcularAba1() {
  const cargaVal = document.getElementById('cargaKw')?.value;
  const carga = parseInput(cargaVal);
  const rede = document.getElementById('rede1')?.value;
  const ligacao = document.getElementById('ligacao1')?.value;

  const box = document.getElementById('resultadoBox1');
  const mainRes = document.getElementById('mainRes1');
  const subRes = document.getElementById('subRes1');
  const caboCu1 = document.getElementById('caboCu1');
  const caboAl1 = document.getElementById('caboAl1');

  if (!box || !mainRes || !subRes) return;

  if (isNaN(carga) || carga <= 0) {
    resetarBox1();
    return;
  }

  const regra = REGRAS.find(r => r.rede === rede && r.ligacao === ligacao && carga > r.min && carga <= r.max);

  if (regra) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Disjuntor Recomendado (A)';
    mainRes.innerText = `${regra.disjuntor} A`;
    mainRes.style.fontSize = '2.2rem';
    if (caboCu1) caboCu1.innerText = regra.cu;
    if (caboAl1) caboAl1.innerText = regra.al;
    subRes.style.display = 'flex';
  } else {
    box.classList.add('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Fora do Limite Normativo';
    subRes.style.display = 'none';

    if (ligacao === 'monofasica') {
      mainRes.innerText = rede === 'aerea'
        ? 'Máx: 10 kW (Mude p/ Bifásica/Trifásica)'
        : 'Máx: 16 kW (Mude p/ Trifásica)';
    } else if (ligacao === 'bifasica') {
      mainRes.innerText = 'Limites: 10 a 20 kW';
    } else {
      mainRes.innerText = rede === 'aerea' ? 'Máx permitido: 75 kW' : 'Máx permitido: 100 kW';
    }
    mainRes.style.fontSize = '1.2rem';
  }
}

// Cálculo da Aba 2 (Descobrir Carga)
function calcularAba2() {
  const disjuntorVal = document.getElementById('disjuntorA')?.value;
  const disjuntor = parseInt(disjuntorVal, 10);
  const rede = document.getElementById('rede2')?.value;
  const ligacao = document.getElementById('ligacao2')?.value;

  const box = document.getElementById('resultadoBox2');
  const mainRes = document.getElementById('mainRes2');
  const subRes = document.getElementById('subRes2');
  const caboCu2 = document.getElementById('caboCu2');
  const caboAl2 = document.getElementById('caboAl2');

  if (!box || !mainRes || !subRes) return;

  if (isNaN(disjuntor) || disjuntor <= 0) {
    box.classList.remove('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Intervalo de Carga (kW)';
    mainRes.innerText = '---';
    mainRes.style.fontSize = '2.2rem';
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
    if (caboCu2) caboCu2.innerText = regra.cu;
    if (caboAl2) caboAl2.innerText = regra.al;
    subRes.style.display = 'flex';
  } else {
    box.classList.add('error');
    const title = box.querySelector('h3');
    if (title) title.innerText = 'Combinação Inexistente';
    subRes.style.display = 'none';
    mainRes.innerText = 'Não há padrão normativo para este disjuntor nesta configuração.';
    mainRes.style.fontSize = '1.2rem';
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

  // Inputs Aba 1
  const cargaW = document.getElementById('cargaW');
  if (cargaW) cargaW.addEventListener('input', converterWattsParaKw);

  const cargaKw = document.getElementById('cargaKw');
  if (cargaKw) cargaKw.addEventListener('input', calcularAba1);

  const rede1 = document.getElementById('rede1');
  if (rede1) rede1.addEventListener('change', calcularAba1);

  const ligacao1 = document.getElementById('ligacao1');
  if (ligacao1) ligacao1.addEventListener('change', calcularAba1);

  // Inputs Aba 2
  const disjuntorA = document.getElementById('disjuntorA');
  if (disjuntorA) disjuntorA.addEventListener('input', calcularAba2);

  const rede2 = document.getElementById('rede2');
  if (rede2) rede2.addEventListener('change', calcularAba2);

  const ligacao2 = document.getElementById('ligacao2');
  if (ligacao2) ligacao2.addEventListener('change', calcularAba2);

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
      .register('./sw.js')
      .then(reg => {
        console.log('[DJ Carga] Service Worker registrado com sucesso:', reg.scope);
      })
      .catch(err => {
        console.error('[DJ Carga] Falha ao registrar Service Worker:', err);
      });
  });
}

