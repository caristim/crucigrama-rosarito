/* ========= GENERADOR AUTOMÁTICO DE CRUCIGRAMAS ========= */
// Función que coloca palabras horizontales y verticales en una cuadrícula
function generateCrossword(wordsAcross, wordsDown, maxRows, maxCols) {
  // Ordenar palabras por longitud descendente para mejorar la colocación
  const across = wordsAcross.map((w, i) => ({ ...w, index: i, dir: 'across' }));
  const down = wordsDown.map((w, i) => ({ ...w, index: i, dir: 'down' }));
  const allWords = [...across, ...down];

  // Ordenar por longitud descendente
  allWords.sort((a, b) => b.answer.length - a.answer.length);

  // Inicializar grid vacía
  const grid = Array.from({ length: maxRows }, () => Array(maxCols).fill(''));
  const placed = [];

  function canPlace(word, row, col, dir) {
    const len = word.answer.length;
    if (dir === 'across') {
      if (col + len > maxCols) return false;
      for (let i = 0; i < len; i++) {
        const r = row;
        const c = col + i;
        const cell = grid[r][c];
        if (cell !== '' && cell !== word.answer[i]) return false;
      }
    } else { // down
      if (row + len > maxRows) return false;
      for (let i = 0; i < len; i++) {
        const r = row + i;
        const c = col;
        const cell = grid[r][c];
        if (cell !== '' && cell !== word.answer[i]) return false;
      }
    }
    return true;
  }

  function placeWord(word, row, col, dir) {
    const len = word.answer.length;
    const positions = [];
    if (dir === 'across') {
      for (let i = 0; i < len; i++) {
        const r = row;
        const c = col + i;
        grid[r][c] = word.answer[i];
        positions.push({ r, c });
      }
    } else {
      for (let i = 0; i < len; i++) {
        const r = row + i;
        const c = col;
        grid[r][c] = word.answer[i];
        positions.push({ r, c });
      }
    }
    placed.push({ word, row, col, dir, positions });
  }

  function removeWord(word) {
    const entry = placed.find(p => p.word === word);
    if (!entry) return;
    for (const pos of entry.positions) {
      grid[pos.r][pos.c] = '';
    }
    const idx = placed.indexOf(entry);
    placed.splice(idx, 1);
  }

  function backtrack(index) {
    if (index === allWords.length) return true; // todas colocadas
    const word = allWords[index];
    const len = word.answer.length;
    const dir = word.dir;
    const maxR = dir === 'across' ? maxRows : maxRows - len + 1;
    const maxC = dir === 'across' ? maxCols - len + 1 : maxCols;

    // Intentar todas las posiciones posibles
    const positions = [];
    for (let r = 0; r < maxR; r++) {
      for (let c = 0; c < maxC; c++) {
        if (canPlace(word, r, c, dir)) {
          positions.push({ r, c });
        }
      }
    }
    // Barajar para obtener variedad
    shuffle(positions);
    for (const pos of positions) {
      placeWord(word, pos.r, pos.c, dir);
      if (backtrack(index + 1)) return true;
      removeWord(word);
    }
    return false;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Intentar backtracking
  const success = backtrack(0);
  if (!success) {
    throw new Error('No se pudo colocar todas las palabras. Intenta con otras palabras o agranda la cuadrícula.');
  }

  // Construir la grid con '#' para celdas vacías y letras para las ocupadas
  const finalGrid = grid.map(row => row.map(cell => (cell === '' ? '#' : cell)).join(''));

  // Generar entries con posiciones y números
  // Asignar números: primero horizontales, luego verticales, en orden de lista original
  const allEntries = [...wordsAcross, ...wordsDown];
  const entries = { across: [], down: [] };
  let number = 1;
  for (const w of allEntries) {
    const placedEntry = placed.find(p => p.word === w);
    if (!placedEntry) continue;
    const row = placedEntry.row;
    const col = placedEntry.col;
    const dir = placedEntry.dir;
    const entry = {
      number: number++,
      row,
      col,
      answer: w.answer,
      clue: w.clue
    };
    if (dir === 'across') {
      entries.across.push(entry);
    } else {
      entries.down.push(entry);
    }
  }

  return {
    grid: finalGrid,
    entries: entries
  };
}

/* ========= CATÁLOGO DE NIVELES (solo palabras y pistas) ========= */
const LEVEL_DEFS = [
  {
    title: "Nivel 1: Principiante",
    size: { rows: 5, cols: 5 },
    words: {
      across: [
        { answer: "SOL", clue: "Astro rey" },
        { answer: "LUNA", clue: "Satélite natural de la Tierra" }
      ],
      down: [
        { answer: "SAL", clue: "Condimento" },
        { answer: "UNO", clue: "Número uno" }
      ]
    }
  },
  {
    title: "Nivel 2: Fácil",
    size: { rows: 6, cols: 6 },
    words: {
      across: [
        { answer: "CASA", clue: "Vivienda" },
        { answer: "PERRO", clue: "Animal doméstico" },
        { answer: "GATO", clue: "Felino" }
      ],
      down: [
        { answer: "CABAL", clue: "Relativo al caballo" },
        { answer: "ARPA", clue: "Instrumento de cuerda" },
        { answer: "OTOÑO", clue: "Estación del año" }
      ]
    }
  },
  {
    title: "Nivel 3: Intermedio",
    size: { rows: 8, cols: 8 },
    words: {
      across: [
        { answer: "BICICLETA", clue: "Vehículo de dos ruedas" },
        { answer: "TELEVISION", clue: "Aparato que recibe imágenes" },
        { answer: "COMPUTADORA", clue: "Ordenador" },
        { answer: "ESCUELA", clue: "Centro de enseñanza" }
      ],
      down: [
        { answer: "BOTE", clue: "Embarcación pequeña" },
        { answer: "LAPIZ", clue: "Instrumento de escritura" },
        { answer: "CUADERNO", clue: "Conjunto de hojas" },
        { answer: "MESA", clue: "Mueble con tablero" }
      ]
    }
  },
  {
    title: "Nivel 4: Avanzado",
    size: { rows: 10, cols: 10 },
    words: {
      across: [
        { answer: "ASTRONOMIA", clue: "Ciencia que estudia los astros" },
        { answer: "BIBLIOTECA", clue: "Lugar donde se guardan libros" },
        { answer: "CIRCULO", clue: "Figura geométrica redonda" },
        { answer: "DOCTOR", clue: "Médico" },
        { answer: "ELEFANTE", clue: "Mamífero con trompa" }
      ],
      down: [
        { answer: "AGUA", clue: "Líquido incoloro" },
        { answer: "BOSQUE", clue: "Lugar con muchos árboles" },
        { answer: "CIELO", clue: "Atmósfera vista desde abajo" },
        { answer: "DIENTE", clue: "Órgano de la boca" },
        { answer: "ESTRELLA", clue: "Cuerpo celeste que brilla" }
      ]
    }
  },
  {
    title: "Nivel 5: Experto",
    size: { rows: 12, cols: 12 },
    words: {
      across: [
        { answer: "ARQUITECTURA", clue: "Arte de construir edificios" },
        { answer: "BIOLOGIA", clue: "Ciencia de la vida" },
        { answer: "CHOCOLATE", clue: "Dulce hecho de cacao" },
        { answer: "DICCIONARIO", clue: "Libro con definiciones" },
        { answer: "ECONOMIA", clue: "Ciencia de la administración" },
        { answer: "FOTOGRAFIA", clue: "Arte de capturar imágenes" }
      ],
      down: [
        { answer: "ALGEBRA", clue: "Rama de las matemáticas" },
        { answer: "BOTANICA", clue: "Ciencia de las plantas" },
        { answer: "CINE", clue: "Arte de las películas" },
        { answer: "DANZA", clue: "Arte de bailar" },
        { answer: "ESCULTURA", clue: "Arte de modelar figuras" },
        { answer: "FISICA", clue: "Ciencia de la materia" }
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

/* ========= CONSTRUCCIÓN DEL TABLERO A PARTIR DEL CRUCIGRAMA GENERADO ========= */
function buildCellIndex(levelData) {
  const { rows, cols } = levelData.size;
  const gridLines = levelData.grid; // array de strings
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

  // Asignar horizontales
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

  // Asignar verticales
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

/* ========= RENDERIZADO ========= */
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

/* ========= SELECCIÓN Y CONTROL DE DIRECCIÓN ========= */
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

/* ========= ESCRITURA Y COMPROBACIÓN ========= */
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
  els.entryText.textContent = entry ? `Pista ${entryNumber}: "${entry.clue}" (Letra ${indexInEntry + 1})` : '—';
}

function renderClues() {
  els.cluesAcross.innerHTML = ''; els.cluesDown.innerHTML = '';
  const generate = (container, list, dir) => {
    for (const e of list) {
      const div = document.createElement('div');
      div.className = 'clueItem';
      div.style.cursor = 'pointer';
      div.innerHTML = `<span class="n">${e.number}.</span><span class="t">${e.clue}</span>`;
      div.addEventListener('click', () => selectCell(e.row, e.col, dir));
      container.appendChild(div);
    }
  };
  generate(els.cluesAcross, cw.entries.across, 'across');
  generate(els.cluesDown, cw.entries.down, 'down');
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
  // Nivel completado
  alert("🎉 ¡Nivel completado! Pasando al siguiente...");
  startLevel(currentLevelIndex + 1);
  return true;
}

/* ========= INICIO DE NIVEL ========= */
function startLevel(index) {
  const total = LEVEL_DEFS.length;
  currentLevelIndex = ((index % total) + total) % total;
  localStorage.setItem('cw_current_level_index', currentLevelIndex);

  const def = LEVEL_DEFS[currentLevelIndex];
  const { rows, cols } = def.size;

  // Generar el crucigrama a partir de las palabras
  const acrossWords = def.words.across || [];
  const downWords = def.words.down || [];
  let generated;
  try {
    generated = generateCrossword(acrossWords, downWords, rows, cols);
  } catch (e) {
    alert('Error al generar el crucigrama: ' + e.message);
    // Intentar con el siguiente nivel
    startLevel(currentLevelIndex + 1);
    return;
  }

  // Construir el objeto cw (compatible con el resto del código)
  cw = {
    title: def.title,
    size: { rows, cols },
    grid: generated.grid,
    entries: generated.entries
  };

  state.active = null;
  state.dirPreferred = 'across';
  state.checkMode = false;
  els.checkBtn.textContent = 'Comprobar';
  els.levelIndicator.textContent = `Nivel ${currentLevelIndex + 1}: ${def.title}`;

  cellIndex = buildCellIndex(cw);
  loadProgress();

  renderClues();
  renderBoard();

  // Seleccionar la primera celda editable
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!cellIndex[r][c].isBlock) { selectCell(r, c); return; }
    }
  }
}

/* ========= EVENTOS E INICIALIZACIÓN ========= */
function init() {
  els.toggleDirBtn.addEventListener('click', (e) => { e.preventDefault(); toggleDirection(); });

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
    if (ev.key === 'Backspace') { ev.preventDefault(); clearAtActive(); return; }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); moveWithinActive(-1); return; }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); moveWithinActive(+1); return; }
    if (ev.key && ev.key.length === 1) {
      const ch = normalizeLetter(ev.key);
      if (isEditableChar(ch)) { ev.preventDefault(); setCharAtActive(ch); }
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
