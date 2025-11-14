// ---------- Utilidades ----------
function animateBars(scope = document) {
  // Lee el % de <small> o data-progress y anima .progress__bar
  scope.querySelectorAll('tr').forEach(row => {
    const bar = row.querySelector('.progress__bar');
    if (!bar) return;
    // intenta leer del pequeño % de la celda
    const pctText = (row.querySelector('td small')?.textContent || '').trim();
    let pct = parseInt(pctText.replace('%',''), 10);
    if (Number.isNaN(pct)) {
      // fallback a data-progress si lo usas
      pct = parseInt(bar.dataset.progress || 0, 10);
    }
    requestAnimationFrame(() => { bar.style.width = Math.max(0, Math.min(100, pct)) + '%'; });
  });
}

function buildMiniProgress() {
  const mini = document.getElementById('goals-mini');
  if (!mini) return;

  mini.innerHTML = ''; // limpia
  // Toma los datos de la tabla
  document.querySelectorAll('#goals-table tbody tr').forEach(row => {
    const name = row.cells?.[0]?.textContent?.trim() || 'Objetivo';
    const pctText = (row.querySelector('td small')?.textContent || '0%').trim();
    const pct = parseInt(pctText.replace('%',''), 10) || 0;

    const card = document.createElement('div');
    card.className = 'goal-chip';
    card.innerHTML = `
      <div class="goal-chip__title">${name}</div>
      <div class="goal-chip__row">
        <span>Progreso</span><strong>${pct}%</strong>
      </div>
      <div class="progress"><div class="progress__bar" style="width:${pct}%"></div></div>
    `;
    mini.appendChild(card);
  });
}

// ---------- Modales <dialog> ----------
const dlgNew  = document.getElementById('modal-new');
const dlgEdit = document.getElementById('modal-edit');
const dlgDel  = document.getElementById('modal-delete');

document.getElementById('btn-open-new')?.addEventListener('click', () => dlgNew?.showModal());
document.querySelector('[data-close-new]')?.addEventListener('click', () => dlgNew?.close());

document.querySelectorAll('[data-edit]').forEach(btn => {
  btn.addEventListener('click', () => dlgEdit?.showModal());
});
document.querySelector('[data-close-edit]')?.addEventListener('click', () => dlgEdit?.close());

document.querySelectorAll('[data-delete]').forEach(btn => {
  btn.addEventListener('click', () => dlgDel?.showModal());
});
document.querySelectorAll('[data-close-delete]').forEach(b => b.addEventListener('click', () => dlgDel?.close()));

// ---------- Filtros (maqueta visual) ----------
document.querySelectorAll('[data-filter]').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
  });
});

// ---------- Búsqueda ----------
const search = document.getElementById('goal-search');
if (search) {
  search.addEventListener('input', () => {
    const term = search.value.toLowerCase();
    document.querySelectorAll('#goals-table tbody tr').forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

// ---------- Inicialización ----------
document.addEventListener('DOMContentLoaded', () => {
  animateBars(document);
  buildMiniProgress();
});
