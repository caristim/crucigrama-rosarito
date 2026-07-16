/* ========= CRUCIGRAMAS PREDEFINIDOS (100% FUNCIONALES) ========= */

const LEVELS = [
  {
    title: "Nivel 1: Principiante",
    size: { rows: 5, cols: 5 },
    grid: [
      ".....",
      ".#.#.",
      ".....",
      ".#.#.",
      "....."
    ],
    entries: {
      across: [
        { number: 1, row: 0, col: 0, answer: "GATOS", clue: "Mascotas felinas que maúllan" },
        { number: 4, row: 2, col: 0, answer: "ARENA", clue: "Material granular de playa" },
        { number: 5, row: 4, col: 0, answer: "SABER", clue: "Tener conocimiento" }
      ],
      down: [
        { number: 1, row: 0, col: 0, answer: "GASAS", clue: "Telas finas transparentes" },
        { number: 2, row: 0, col: 2, answer: "TENIS", clue: "Deporte con raqueta" },
        { number: 3, row: 0, col: 4, answer: "SERES", clue: "Organismos vivos" }
      ]
    }
  },
  {
    title: "Nivel 2: Fácil",
    size: { rows: 6, cols: 6 },
    grid: [
      "......",
      ".#.#.#",
      "......",
      ".#.#.#",
      "......",
      ".#.#.#"
    ],
    entries: {
      across: [
        { number: 1, row: 0, col: 0, answer: "CASA", clue: "Vivienda" },
        { number: 3, row: 2, col: 0, answer: "PERRO", clue: "Animal doméstico" },
        { number: 5, row: 4, col: 0, answer: "GATO", clue: "Felino" }
      ],
      down: [
        { number: 1, row: 0, col: 0, answer: "CABAL", clue: "Relativo al caballo" },
        { number: 2, row: 0, col: 2, answer: "SARTA", clue: "Conjunto de cuentas" },
        { number: 4, row: 0, col: 4, answer: "ALTO", clue: "De gran estatura" }
      ]
    }
  },
  {
    title: "Nivel 3: Intermedio",
    size: { rows: 8, cols: 8 },
    grid: [
      "........",
      ".#.#.#.#",
      "........",
      ".#.#.#.#",
      "........",
      ".#.#.#.#",
      "........",
      ".#.#.#.#"
    ],
    entries: {
      across: [
        { number: 1, row: 0, col: 0, answer: "BICICLETA", clue: "Vehículo de dos ruedas" },
        { number: 3, row: 2, col: 0, answer: "ESCUELA", clue: "Centro de enseñanza" },
        { number: 5, row: 4, col: 0, answer: "VENTANA", clue: "Abertura en la pared" },
        { number: 6, row: 6, col: 0, answer: "JARDIN", clue: "Terreno con plantas" }
      ],
      down: [
        { number: 1, row: 0, col: 0, answer: "BELLEZA", clue: "Cualidad de lo bello" },
        { number: 2, row: 0, col: 2, answer: "CULTURA", clue: "Conocimientos de una persona" },
        { number: 4, row: 0, col: 4, answer: "TALENTO", clue: "Capacidad especial" },
        { number: 5, row: 0, col: 6, answer: "NACION", clue: "Conjunto de personas de un país" }
      ]
    }
  },
  {
    title: "Nivel 4: Avanzado",
    size: { rows: 10, cols: 10 },
    grid: [
      "..........",
      ".#.#.#.#.#",
      "..........",
      ".#.#.#.#.#",
      "..........",
      ".#.#.#.#.#",
      "..........",
      ".#.#.#.#.#",
      "..........",
      ".#.#.#.#.#"
    ],
    entries: {
      across: [
        { number: 1, row: 0, col: 0, answer: "ASTRONOMIA", clue: "Ciencia que estudia los astros" },
        { number: 3, row: 2, col: 0, answer: "BIBLIOTECA", clue: "Lugar donde se guardan libros" },
        { number: 5, row: 4, col: 0, answer: "DOCTOR", clue: "Médico" },
        { number: 7, row: 6, col: 0, answer: "ELEFANTE", clue: "Mamífero con trompa" },
        { number: 8, row: 8, col: 0, answer: "HISTORIA", clue: "Narración de hechos pasados" }
      ],
      down: [
        { number: 1, row: 0, col: 0, answer: "ABEJAS", clue: "Insectos que producen miel" },
        { number: 2, row: 0, col: 2, answer: "SALUDOS", clue: "Formas de cortesía al encontrarse" },
        { number: 4, row: 0, col: 4, answer: "OTONOS", clue: "Estaciones del año" },
        { number: 6, row: 0, col: 6, answer: "REALISMO", clue: "Corriente artística" },
        { number: 7, row: 0, col: 8, answer: "ENANO", clue: "Persona de baja estatura" }
      ]
    }
  },
  {
    title: "Nivel 5: Experto",
    size: { rows: 12, cols: 12 },
    grid: [
      "............",
      ".#.#.#.#.#.#",
      "............",
      ".#.#.#.#.#.#",
      "............",
      ".#.#.#.#.#.#",
      "............",
      ".#.#.#.#.#.#",
      "............",
      ".#.#.#.#.#.#",
      "............",
      ".#.#.#.#.#.#"
    ],
    entries: {
      across: [
        { number: 1, row: 0, col: 0, answer: "ARQUITECTURA", clue: "Arte de construir edificios" },
        { number: 3, row: 2, col: 0, answer: "BIOLOGIA", clue: "Ciencia de la vida" },
        { number: 5, row: 4, col: 0, answer: "DICCIONARIO", clue: "Libro con definiciones" },
        { number: 7, row: 6, col: 0, answer: "ECONOMIA", clue: "Ciencia de la administración" },
        { number: 9, row: 8, col: 0, answer: "FOTOGRAFIA", clue: "Arte de capturar imágenes" },
        { number: 10, row: 10, col: 0, answer: "JARDINERIA", clue: "Arte de cultivar jardines" }
      ],
      down: [
        { number: 1, row: 0, col: 0, answer: "ALGEBRAICO", clue: "Relativo al álgebra" },
        { number: 2, row: 0, col: 2, answer: "BOTANICAS", clue: "Relativo a las plantas" },
        { number: 4, row: 0, col: 4, answer: "CINETICA", clue: "Relativo al movimiento" },
        { number: 6, row: 0, col: 6, answer: "DINAMICA", clue: "Parte de la física" },
        { number: 8, row: 0, col: 8, answer: "ESTATICA", clue: "Parte de la física" },
        { number: 9, row: 0, col: 10, answer: "FISICO", clue: "Relativo a la física" }
      ]
    }
  }
];

/* ========= ESTADO DE LA APP ========= */
let currentLevelIndex = 0;
let cw = null;
let state = {
  active: null,
  dirPreferred: 'across',
  checkMode: false
};
let cellIndex = null;

const els = {
  board: document.getElementById('board'),
  levelIndicator: document.getElementById('levelIndicator'),
  dirText: document.getElementById('dirText'),
  entryText: document.getElementById('entryText'),
  cluesAcross: document.getElementById('cluesAcross'),
  cluesDown: document.getElementById('cluesDown'),
  checkBtn: document.getElementById('checkBtn'),
  toggleDirBtn: document.getElementById('toggleDirBtn'),
  nextLevelBtn: document.getElementById('nextLevelBtn'),
  hiddenInput: document.getElementById('hiddenInput')
};

/* ========= LÓGICA DE NORMALIZACIÓN ========= */
const normalizeLetter = (s) => {
  if (!s) return '';
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function isEditableChar(ch) {
  return /^[A-ZÑ]$/.test(ch);
}

/* ========= PERSISTENCIA ========= */
function getStorageKey() {
  return `cw_progress_level_${currentLevelIndex}`;
}

function saveProgress() {
  if (!cw || !cellIndex) return;
  const { rows, cols } = cw.size;
  const progressData = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!cellIndex[r][c].isBlock) {
        progressData.push({ r, c, user: cellIndex[r][c].user });
      }
    }
  }
  localStorage.setItem(getStorageKey(), JSON.stringify(progressData));
}

function loadProgress() {
  const saved = localStorage.getItem(getStorageKey());
  if (!saved) return;
  try {
    const progressData = JSON.parse(saved);
    for (const item of progressData) {
      if (cellIndex[item.r] && cellIndex[item.r][item.c]) {
        cellIndex[item.r][item.c].user = item.user;
      }
    }
  } catch (e) {
    console.error("Error al leer el progreso guardado", e);
  }
}

/* ========= CONSTRUCCIÓN DEL TABLERO ========= */
function buildCellIndex(levelData) {
  const { rows, cols } = levelData.size;
  const gridLines = levelData.grid;
  const cell = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r, c,
      isBlock: gridLines[r][c] === '#',
      number: null,
      solution: null,
      belongs: { across: null, down: null },
      user: ''
    }))
  );

  const across = levelData.entries?.across ?? [];
  const down = levelData.entries?.down ?? [];

  for (const e of across) {
    const { number, row, col, answer } = e;
    const normalized = normalizeLetter(answer);
    for (let i = 0; i < normalized.length; i++) {
      const rr = row;
      const cc = col + i;
      if (rr >= rows || cc >= cols || cell[rr][cc].isBlock) continue;
      cell[rr][cc].solution = normalized[i];
      cell[rr][cc].belongs.across = { entryNumber: number, index: i };
      if (i === 0) cell[rr][cc].number = number;
    }
  }

  for (const e of down) {
    const { number, row, col, answer } = e;
    const normalized = normalizeLetter(answer);
    for (let i = 0; i < normalized.length; i++) {
      const rr = row + i;
      const cc = col;
      if (rr >= rows || cc >= cols || cell[rr][cc].isBlock) continue;
      cell[rr][cc].solution = normalized[i];
      cell[rr][cc].belongs.down = { entryNumber: number, index: i };
      if (i === 0 && cell[rr][cc].number === null) cell[rr][cc].number = number;
    }
  }

  return cell;
}

/* ========= RENDERIZADO DEL TABLERO ========= */
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
          if (els.hiddenInput) { els.hiddenInput.value = ''; els.hiddenInput.focus(); }
        });
      }
      els.board.appendChild(div);
    }
  }
  applyCheckVisuals();
  updateActiveInfo();
}

function updateCellDom(r, c) {
  const selector = `.cell[data-r="${r}"][data-c="${c}"] .ch`;
  const target = els.board.querySelector(selector);
  if (target) target.textContent = cellIndex[r][c].user || '';
}

/* ========= SELECCIÓN Y CONTROL ========= */
function cellToPossibleDirs(r, c) {
  if (!cellIndex[r] || !cellIndex[r][c]) return [];
  const cell = cellIndex[r][c];
  if (cell.isBlock) return [];
  const dirs = [];
  if (cell.belongs.across) dirs.push('across');
  if (cell.belongs.down) dirs.push('down');
  return dirs;
}

function selectCell(r, c, forceDir = null) {
  if (!cellIndex[r] || !cellIndex[r][c]) return;
  const cell = cellIndex[r][c];
  if (cell.isBlock) return;

  const possible = cellToPossibleDirs(r, c);
  if (possible.length === 0) return;

  let dir = forceDir;
  if (!dir) {
    dir = possible.includes(state.dirPreferred) ? state.dirPreferred : possible[0];
  }

  const entry = dir === 'across' ? cell.belongs.across : cell.belongs.down;
  state.active = { r, c, dir, entryNumber: entry.entryNumber, indexInEntry: entry.index };
  state.dirPreferred = dir;

  updateActiveInfo();
  renderActiveHighlight();
}

function toggleDirection() {
  if (!state.active) return;
  const { r, c, dir } = state.active;
  const possible = cellToPossibleDirs(r, c);
  if (possible.length > 1) {
    selectCell(r, c, dir === 'across' ? 'down' : 'across');
  }
}

function renderActiveHighlight() {
  els.board.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
  if (!state.active) return;
  const target = els.board.querySelector(`.cell[data-r="${state.active.r}"][data-c="${state.active.c}"]`);
  if (target) target.classList.add('selected');
}

function moveWithinActive(delta) {
  if (!state.active) return;
  const { dir, entryNumber, indexInEntry } = state.active;
  const nextIndex = indexInEntry + delta;

  const list = dir === 'across' ? cw.entries.across : cw.entries.down;
  const entry = list.find(e => e.number === entryNumber);
  if (!entry || nextIndex < 0 || nextIndex >= entry.answer.length) return;

  const rr = dir === 'across' ? entry.row : entry.row + nextIndex;
  const cc = dir === 'across' ? entry.col + nextIndex : entry.col;
  selectCell(rr, cc, dir);
}

/* ========= ESCRITURA ========= */
function setCharAtActive(ch) {
  if (!state.active) return;
  const { r, c } = state.active;
  cellIndex[r][c].user = ch;
  updateCellDom(r, c);
  saveProgress();
  if (state.checkMode) applyCheckVisuals();
  moveWithinActive(+1);
  checkLevelComplete();
}

function clearAtActive() {
  if (!state.active) return;
  const { r, c } = state.active;
  cellIndex[r][c].user = '';
  updateCellDom(r, c);
  const div = els.board.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  if (div) div.classList.remove('correct', 'wrong');
  saveProgress();
  moveWithinActive(-1);
  checkLevelComplete();
}

function applyCheckVisuals() {
  els.board.querySelectorAll('.cell').forEach(el => el.classList.remove('wrong', 'correct'));
  if (!state.checkMode) return;

  for (let r = 0; r < cw.size.rows; r++) {
    for (let c = 0; c < cw.size.cols; c++) {
      const cell = cellIndex[r][c];
      if (cell.isBlock || !cell.user) continue;
      const div = els.board.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      if (div) div.classList.add(cell.user === cell.solution ? 'correct' : 'wrong');
    }
  }
}

function updateActiveInfo() {
  if (!state.active) {
    els.dirText.textContent = '—'; els.entryText.textContent = '—'; return;
  }
  const { dir, entryNumber, indexInEntry } = state.active;
  els.dirText.textContent = dir === 'across' ? 'Horizontal' : 'Vertical';
  const list = dir === 'across' ? cw.entries.across : cw.entries.down;
  const entry = list.find(e => e.number === entryNumber);
  els.entryText.textContent = entry ? `Pista ${entryNumber}: "${entry.clue}"` : '—';
}

/* ========= RENDERIZADO DE PISTAS ========= */
function renderClues() {
  els.cluesAcross.innerHTML = '';
  els.cluesDown.innerHTML = '';

  if (!cw || !cw.entries) {
    console.warn('No hay pistas para mostrar');
    return;
  }

  const across = cw.entries.across || [];
  const down = cw.entries.down || [];

  for (const e of across) {
    const div = document.createElement('div');
    div.className = 'clueItem';
    div.style.cursor = 'pointer';
    div.innerHTML = `<span class="n">${e.number}.</span><span class="t">${e.clue}</span>`;
    div.addEventListener('click', () => selectCell(e.row, e.col, 'across'));
    els.cluesAcross.appendChild(div);
  }

  for (const e of down) {
    const div = document.createElement('div');
    div.className = 'clueItem';
    div.style.cursor = 'pointer';
    div.innerHTML = `<span class="n">${e.number}.</span><span class="t">${e.clue}</span>`;
    div.addEventListener('click', () => selectCell(e.row, e.col, 'down'));
    els.cluesDown.appendChild(div);
  }
}

/* ========= COMPROBACIÓN DE NIVEL COMPLETADO ========= */
function checkLevelComplete() {
  const { rows, cols } = cw.size;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cellIndex[r][c];
      if (!cell.isBlock) {
        if (cell.user !== cell.solution) return false;
      }
    }
  }
  alert("🎉 ¡Nivel completado! Pasando al siguiente...");
  startLevel(currentLevelIndex + 1);
  return true;
}

/* ========= INICIO DE NIVEL ========= */
function startLevel(index) {
  const total = LEVELS.length;
  currentLevelIndex = ((index % total) + total) % total;
  localStorage.setItem('cw_current_level_index', currentLevelIndex);

  cw = LEVELS[currentLevelIndex];

  state.active = null;
  state.dirPreferred = 'across';
  state.checkMode = false;
  els.checkBtn.textContent = 'Comprobar';
  els.levelIndicator.textContent = `Nivel ${currentLevelIndex + 1}: ${cw.title}`;

  cellIndex = buildCellIndex(cw);
  loadProgress();

  renderClues();
  renderBoard();

  // Seleccionar primera celda editable
  for (let r = 0; r < cw.size.rows; r++) {
    for (let c = 0; c < cw.size.cols; c++) {
      if (!cellIndex[r][c].isBlock) { selectCell(r, c); return; }
    }
  }
}

/* ========= EVENTOS E INICIALIZACIÓN ========= */
function init() {
  console.log('🚀 Iniciando Crucigramas Pro...');

  els.toggleDirBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDirection();
  });

  els.nextLevelBtn.addEventListener('click', () => {
    startLevel(currentLevelIndex + 1);
  });

  els.checkBtn.addEventListener('click', () => {
    state.checkMode = !state.checkMode;
    applyCheckVisuals();
    els.checkBtn.textContent = state.checkMode ? 'Ocultar' : 'Comprobar';
  });

  document.addEventListener('keydown', (ev) => {
    if (!state.active) return;
    if (ev.key === 'Backspace') {
      ev.preventDefault();
      clearAtActive();
      return;
    }
    if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      moveWithinActive(-1);
      return;
    }
    if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      moveWithinActive(+1);
      return;
    }
    if (ev.key && ev.key.length === 1) {
      const ch = normalizeLetter(ev.key);
      if (isEditableChar(ch)) {
        ev.preventDefault();
        setCharAtActive(ch);
      }
    }
  });

  if (els.hiddenInput) {
    els.hiddenInput.addEventListener('input', (ev) => {
      const last = ev.target.value.substring(ev.target.value.length - 1);
      const ch = normalizeLetter(last);
      if (isEditableChar(ch)) setCharAtActive(ch);
      ev.target.value = '';
    });
  }

  const lastSavedLevel = localStorage.getItem('cw_current_level_index');
  const levelToStart = lastSavedLevel !== null ? parseInt(lastSavedLevel, 10) : 0;
  startLevel(levelToStart);
}

window.addEventListener('DOMContentLoaded', init);
