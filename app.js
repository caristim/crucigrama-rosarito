/* ========= Util ========= */
const normalizeLetter = (s) => {
  if (!s) return '';
  // Convertimos a mayúsculas, respetando Ñ
  return s.toUpperCase();
};

function isEditableChar(ch) {
  // A-Z y Ñ/ÁÉÍÓÚÜ (aceptamos todo lo que sea letra)
  return /^[A-ZÁÉÍÓÚÜÑ]$/.test(ch);
}

/* ========= Estado ========= */
let cw = null; // crucigrama cargado
let state = {
  active: null, // { r, c, dir, entryNumber, entryId }
  dirPreferred: 'across', // si una casilla pertenece a ambas
  checkMode: false
};

const els = {
  board: document.getElementById('board'),
  cwSelect: document.getElementById('cwSelect'),
  dirText: document.getElementById('dirText'),
  entryText: document.getElementById('entryText'),
  cluesAcross: document.getElementById('cluesAcross'),
  cluesDown: document.getElementById('cluesDown'),
  checkBtn: document.getElementById('checkBtn'),
  clearBtn: document.getElementById('clearBtn')
};

/* ========= Loader ========= */
async function loadIndex() {
  const res = await fetch('data/index.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo cargar data/index.json');
  return res.json();
}

async function loadCrossword(file) {
  const res = await fetch(`data/crosswords/${file}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
  return res.json();
}

/* ========= Modelado del tablero ========= */
function buildCellIndex(cw) {
  const { rows, cols } = cw.size;
  const cell = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r, c,
      isBlock: cw.grid[r][c] === '#',
      number: null,
      // soluciones y edición
      solution: null, // letra correcta
      clueNumberAcross: null,
      clueNumberDown: null,
      belongs: { across: null, down: null }, // entryNumber -> meta
      // user state
      user: ''
    }))
  );

  // Numeración + mapping entries -> celdas
  const across = cw.entries?.across ?? [];
  const down = cw.entries?.down ?? [];

  // Para mantener coherencia, asumimos que los entry answer encajan en la cuadrícula
  for (const e of across) {
    const { number, row, col, answer } = e;
    for (let i = 0; i < answer.length; i++) {
      const rr = row;
      const cc = col + i;
      if (cell[rr]?.[cc]?.isBlock) continue;
      if (cell[rr][cc].solution == null) cell[rr][cc].solution = answer[i];
      cell[rr][cc].belongs.across = { entryNumber: number, index: i };
      // número visual al inicio
      if (i === 0) cell[rr][cc].clueNumberAcross = number;
    }
  }

  for (const e of down) {
    const { number, row, col, answer } = e;
    for (let i = 0; i < answer.length; i++) {
      const rr = row + i;
      const cc = col;
      if (cell[rr]?.[cc]?.isBlock) continue;
      if (cell[rr][cc].solution == null) cell[rr][cc].solution = answer[i];
      cell[rr][cc].belongs.down = { entryNumber: number, index: i };
      if (i === 0) cell[rr][cc].clueNumberDown = number;
    }
  }

  // Número visible:
  // En crucigramas, normalmente se numera si inicia una across o down.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = cell[r][c].clueNumberAcross;
      const d = cell[r][c].clueNumberDown;
      if (a != null || d != null) cell[r][c].number = a ?? d;
    }
  }

  return cell;
}

/* ========= Render ========= */
let cellIndex = null; // grid model with user state

function renderBoard() {
  const { rows, cols } = cw.size;
  els.board.innerHTML = '';
  els.board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cellIndex[r][c];
      const div = document.createElement('div');
      div.className = 'cell' + (cell.isBlock ? ' block' : ' editable');

      if (!cell.isBlock) {
        div.dataset.r = r;
        div.dataset.c = c;

        if (cell.number != null) {
          const num = document.createElement('div');
          num.className = 'num';
          num.textContent = String(cell.number);
          div.appendChild(num);
        }

        const ch = document.createElement('div');
        ch.className = 'ch';
        ch.textContent = cell.user || '';
        div.appendChild(ch);

        div.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          selectCell(r, c);
          div.focus?.();
        });

        div.addEventListener('keydown', (ev) => {
          // por si alguien usa teclado sobre celda
          // (no es obligatorio porque capturamos globalmente)
          ev.preventDefault();
        });
      }

      els.board.appendChild(div);
    }
  }

  // Aplicar estado visual de correct/wrong si checkMode
  applyCheckVisuals();

  updateActiveInfo();
}

function updateCellDom(r, c) {
  // actualizar solo la celda enfocada/afectada
  const selector = `.cell[data-r="${r}"][data-c="${c}"] .ch`;
  const target = els.board.querySelector(selector);
  if (target) target.textContent = cellIndex[r][c].user || '';
}

/* ========= Selección (orientación 2) ========= */
function cellToPossibleDirs(r, c) {
  const cell = cellIndex[r][c];
  if (cell.isBlock) return [];
  const dirs = [];
  if (cell.belongs.across) dirs.push('across');
  if (cell.belongs.down) dirs.push('down');
  return dirs;
}

function selectCell(r, c) {
  const cell = cellIndex[r][c];
  if (cell.isBlock) return;

  const possible = cellToPossibleDirs(r, c);
  if (possible.length === 0) return;

  // Si pertenece a ambas, usamos el preferido actual (dirPreferred)
  let dir;
  if (possible.length === 1) dir = possible[0];
  else {
    dir = state.dirPreferred;
    if (!possible.includes(dir)) dir = possible[0];
  }

  state.active = getActiveEntryFromCell(r, c, dir);
  state.dirPreferred = dir; // la próxima vez, favorecemos la última elegida
  updateActiveInfo();
  renderActiveHighlight();
}

function getActiveEntryFromCell(r, c, dir) {
  const cell = cellIndex[r][c];
  const entry = dir === 'across' ? cell.belongs.across : cell.belongs.down;
  return {
    r, c,
    dir,
    entryNumber: entry.entryNumber,
    indexInEntry: entry.index
  };
}

function renderActiveHighlight() {
  els.board.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
  if (!state.active) return;

  const { r, c } = state.active;
  const target = els.board.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  if (target) target.classList.add('selected');
}

/* ========= Navegación ========= */
function getNextEditableCell(r, c, dir, delta) {
  // delta: +1 avanzar, -1 retroceder dentro del mismo entry
  const cell = cellIndex[r][c];
  const belongs = dir === 'across' ? cell.belongs.across : cell.belongs.down;
  if (!belongs) return null;

  const nextIndex = belongs.index + delta;

  // Necesitamos saber el inicio del entry para ubicar la celda por index.
  // MVP: lo sacamos buscando en entries para esa entrada y dir.
  const start = findEntryStart(dir, belongs.entryNumber);
  if (!start) return null;

  if (dir === 'across') {
    const rr = start.row;
    const cc = start.col + nextIndex;
    if (cc < 0 || cc >= cw.size.cols) return null;
    return { r: rr, c: cc };
  } else {
    const rr = start.row + nextIndex;
    const cc = start.col;
    if (rr < 0 || rr >= cw.size.rows) return null;
    return { r: rr, c: cc };
  }
}

function findEntryStart(dir, entryNumber) {
  const list = dir === 'across' ? (cw.entries?.across ?? []) : (cw.entries?.down ?? []);
  return list.find(e => e.number === entryNumber) ?? null;
}

function moveWithinActive(delta) {
  if (!state.active) return;
  const { r, c, dir } = state.active;

  const next = getNextEditableCell(r, c, dir, delta);
  if (!next) return;

  selectCell(next.r, next.c);
}

/* ========= Input ========= */
function setCharAtActive(ch) {
  if (!state.active) return;
  const { r, c } = state.active;
  const cell = cellIndex[r][c];
  if (cell.isBlock) return;

  cell.user = ch;
  updateCellDom(r, c);

  // al escribir, avanzamos un paso
  moveWithinActive(+1);
}

function clearAtActive() {
  if (!state.active) return;
  const { r, c } = state.active;
  const cell = cellIndex[r][c];
  if (cell.isBlock) return;

  cell.user = '';
  updateCellDom(r, c);
}

/* ========= Comprobación ========= */
function applyCheckVisuals() {
  els.board.querySelectorAll('.cell').forEach(el => {
    el.classList.remove('wrong', 'correct');
  });

  if (!state.checkMode) return;

  const { rows, cols } = cw.size;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cellIndex[r][c];
      if (cell.isBlock) continue;

      if (!cell.user) continue;
      if (!cell.solution) continue;

      const div = els.board.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      if (!div) continue;

      if (cell.user === cell.solution) div.classList.add('correct');
      else div.classList.add('wrong');
    }
  }
}

function updateActiveInfo() {
  if (!state.active) {
    els.dirText.textContent = '—';
    els.entryText.textContent = '—';
    return;
  }
  const { dir, entryNumber, indexInEntry } = state.active;
  els.dirText.textContent = dir === 'across' ? 'Horizontal' : 'Vertical';
  els.entryText.textContent = `${entryNumber} (letra ${indexInEntry + 1})`;
}

/* ========= Pistas ========= */
function renderClues() {
  const across = cw.entries?.across ?? [];
  const down = cw.entries?.down ?? [];

  els.cluesAcross.innerHTML = '';
  els.cluesDown.innerHTML = '';

  const renderList = (container, list) => {
    const frag = document.createDocumentFragment();
    for (const e of list) {
      const item = document.createElement('div');
      item.className = 'clueItem';
      item.innerHTML = `<span class="n">${e.number}.</span><span class="t">${escapeHtml(e.clue ?? '')}</span>`;
      frag.appendChild(item);
    }
    container.appendChild(frag);
  };

  renderList(els.cluesAcross, across);
  renderList(els.cluesDown, down);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));
}

/* ========= Keyboard ========= */
function onKeyDown(ev) {
  if (!cw) return;
  if (!state.active) return;

  // Si estás escribiendo en un control, ignora (evitamos interferir con select)
  const tag = (ev.target?.tagName ?? '').toLowerCase();
  if (tag === 'select' || tag === 'input' || tag === 'textarea') return;

  const key = ev.key;

  if (key === 'Backspace') {
    ev.preventDefault();
    clearAtActive();
    return;
  }

  if (key === 'ArrowLeft') { ev.preventDefault(); if (state.active.dir === 'across') moveWithinActive(-1); return; }
  if (key === 'ArrowRight') { ev.preventDefault(); if (state.active.dir === 'across') moveWithinActive(+1); return; }
  if (key === 'ArrowUp') { ev.preventDefault(); if (state.active.dir === 'down') moveWithinActive(-1); return; }
  if (key === 'ArrowDown') { ev.preventDefault(); if (state.active.dir === 'down') moveWithinActive(+1); return; }

  if (key === 'Tab') {
    ev.preventDefault();
    // Tab avanza una letra dentro de la dirección actual
    moveWithinActive(ev.shiftKey ? -1 : +1);
    return;
  }

  // letras
  if (key && key.length === 1) {
    const ch = normalizeLetter(key);
    if (isEditableChar(ch)) {
      ev.preventDefault();
      setCharAtActive(ch);
      return;
    }
  }

  // Soporte a pegado rápido (opcional)
  if (ev.ctrlKey || ev.metaKey || key === 'Enter') {
    // no hacemos nada por ahora
  }
}

/* ========= Crucigrama carga ========= */
async function init() {
  const index = await loadIndex();

  // Poblamos selector
  els.cwSelect.innerHTML = '';
  for (const item of index) {
    const opt = document.createElement('option');
    opt.value = item.file;
    opt.textContent = item.title;
    els.cwSelect.appendChild(opt);
  }

  const initialFile = index[0]?.file;
  if (initialFile) {
    els.cwSelect.value = initialFile;
    await loadAndStart(initialFile);
  }

  els.cwSelect.addEventListener('change', async () => {
    const file = els.cwSelect.value;
    await loadAndStart(file);
  });

  els.checkBtn.addEventListener('click', () => {
    state.checkMode = !state.checkMode;
    applyCheckVisuals();
    els.checkBtn.textContent = state.checkMode ? 'Ocultar comprobación' : 'Comprobar';
  });

  els.clearBtn.addEventListener('click', () => {
    if (!cw) return;
    const { rows, cols } = cw.size;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!cellIndex[r][c].isBlock) cellIndex[r][c].user = '';
      }
    }
    renderBoard();
    // Mantener selección si existiera
  });

  document.addEventListener('keydown', onKeyDown);
}

async function loadAndStart(file) {
  cw = await loadCrossword(file);
  state.active = null;
  state.dirPreferred = 'across';
  state.checkMode = false;

  cellIndex = buildCellIndex(cw);
  renderClues();
  renderBoard();

  // Seleccionamos primera casilla editable de across si existe
  const first = findFirstEditableCell(cw);
  if (first) {
    // si existe across en esa casilla, preferimos across
    const possible = cellToPossibleDirs(first.r, first.c);
    if (possible.includes('across')) state.dirPreferred = 'across';
    else if (possible.includes('down')) state.dirPreferred = 'down';
    selectCell(first.r, first.c);
    renderActiveHighlight();
  }
}

function findFirstEditableCell(cw) {
  const { rows, cols } = cw.size;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cellIndex[r][c] && !cellIndex[r][c].isBlock) return { r, c };
    }
  }
  return null;
}

/* ========= Iniciar ========= */
init().catch(err => {
  console.error(err);
  els.board.innerHTML = '<div style="padding:12px;color:#fecaca">Error al cargar crucigramas.</div>';
});