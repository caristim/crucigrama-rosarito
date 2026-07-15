/* ========= GENERADOR SIMPLE Y CONFIABLE DE CRUCIGRAMAS ========= */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateCrossword(wordBankAcross, wordBankDown, maxRows, maxCols) {
  // Filtrar palabras que quepan exactamente
  const across = wordBankAcross.filter(w => w.answer.length <= maxCols);
  const down = wordBankDown.filter(w => w.answer.length <= maxRows);
  
  // Si no hay suficientes palabras, usar las primeras disponibles
  const finalAcross = across.length > 0 ? across : wordBankAcross.slice(0, 3);
  const finalDown = down.length > 0 ? down : wordBankDown.slice(0, 3);

  // Seleccionar palabras aleatorias (2-4 de cada tipo según tamaño)
  const shuffledAcross = shuffle([...finalAcross]);
  const shuffledDown = shuffle([...finalDown]);
  
  const numAcross = Math.min(shuffledAcross.length, Math.max(2, Math.floor((maxRows + maxCols) / 5)));
  const numDown = Math.min(shuffledDown.length, Math.max(2, Math.floor((maxRows + maxCols) / 5)));
  
  const selectedAcross = shuffledAcross.slice(0, numAcross);
  const selectedDown = shuffledDown.slice(0, numDown);

  // Crear grid vacía
  const grid = Array.from({ length: maxRows }, () => Array(maxCols).fill(''));
  const placed = [];

  // Función para colocar una palabra
  function tryPlaceWord(word, dir) {
    const len = word.answer.length;
    const positions = [];
    
    if (dir === 'across') {
      for (let r = 0; r < maxRows; r++) {
        for (let c = 0; c <= maxCols - len; c++) {
          let canPlace = true;
          for (let i = 0; i < len; i++) {
            if (grid[r][c + i] !== '' && grid[r][c + i] !== word.answer[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) positions.push({ r, c });
        }
      }
    } else {
      for (let r = 0; r <= maxRows - len; r++) {
        for (let c = 0; c < maxCols; c++) {
          let canPlace = true;
          for (let i = 0; i < len; i++) {
            if (grid[r + i][c] !== '' && grid[r + i][c] !== word.answer[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) positions.push({ r, c });
        }
      }
    }
    
    shuffle(positions);
    if (positions.length === 0) return false;
    
    const pos = positions[0];
    const wordPos = [];
    if (dir === 'across') {
      for (let i = 0; i < len; i++) {
        grid[pos.r][pos.c + i] = word.answer[i];
        wordPos.push({ r: pos.r, c: pos.c + i });
      }
    } else {
      for (let i = 0; i < len; i++) {
        grid[pos.r + i][pos.c] = word.answer[i];
        wordPos.push({ r: pos.r + i, c: pos.c });
      }
    }
    placed.push({ word, row: pos.r, col: pos.c, dir, positions: wordPos });
    return true;
  }

  // Colocar palabras horizontales (más largas primero)
  const sortedAcross = [...selectedAcross].sort((a, b) => b.answer.length - a.answer.length);
  for (const word of sortedAcross) {
    tryPlaceWord(word, 'across');
  }

  // Colocar palabras verticales (más largas primero)
  const sortedDown = [...selectedDown].sort((a, b) => b.answer.length - a.answer.length);
  for (const word of sortedDown) {
    tryPlaceWord(word, 'down');
  }

  // Si no hay palabras colocadas, usar un fallback simple
  if (placed.length === 0) {
    // Colocar las primeras horizontales en la fila 0
    for (let i = 0; i < Math.min(3, selectedAcross.length); i++) {
      const word = selectedAcross[i];
      if (word.answer.length <= maxCols) {
        for (let j = 0; j < word.answer.length; j++) {
          grid[0][j] = word.answer[j];
        }
        const wordPos = [];
        for (let j = 0; j < word.answer.length; j++) {
          wordPos.push({ r: 0, c: j });
        }
        placed.push({ word, row: 0, col: 0, dir: 'across', positions: wordPos });
      }
    }
    
    // Colocar las primeras verticales en la columna 0
    for (let i = 0; i < Math.min(3, selectedDown.length); i++) {
      const word = selectedDown[i];
      if (word.answer.length <= maxRows) {
        for (let j = 0; j < word.answer.length; j++) {
          if (grid[j][0] === '') {
            grid[j][0] = word.answer[j];
          }
        }
        const wordPos = [];
        for (let j = 0; j < word.answer.length; j++) {
          wordPos.push({ r: j, c: 0 });
        }
        placed.push({ word, row: 0, col: 0, dir: 'down', positions: wordPos });
      }
    }
  }

  // Construir la grid final
  const finalGrid = grid.map(row => row.map(cell => (cell === '' ? '#' : cell)).join(''));

  // Generar entries con números
  const entries = { across: [], down: [] };
  let number = 1;
  
  // Primero asignar números a las horizontales
  for (const p of placed) {
    if (p.dir === 'across') {
      const entry = {
        number: number++,
        row: p.row,
        col: p.col,
        answer: p.word.answer,
        clue: p.word.clue
      };
      entries.across.push(entry);
    }
  }
  
  // Luego a las verticales
  for (const p of placed) {
    if (p.dir === 'down') {
      const entry = {
        number: number++,
        row: p.row,
        col: p.col,
        answer: p.word.answer,
        clue: p.word.clue
      };
      entries.down.push(entry);
    }
  }

  return { grid: finalGrid, entries };
}

/* ========= BANCO DE PALABRAS POR NIVEL ========= */
const LEVEL_BANKS = [
  {
    title: "Nivel 1: Principiante",
    size: { rows: 5, cols: 5 },
    bank: {
      across: [
        { answer: "SOL", clue: "Astro rey" },
        { answer: "LUNA", clue: "Satélite natural" },
        { answer: "MAR", clue: "Gran masa de agua" },
        { answer: "CIELO", clue: "Espacio sobre nosotros" },
        { answer: "AVION", clue: "Medio de transporte aéreo" }
      ],
      down: [
        { answer: "SAL", clue: "Condimento" },
        { answer: "UNO", clue: "Número uno" },
        { answer: "DOS", clue: "Número dos" },
        { answer: "TRES", clue: "Número tres" },
        { answer: "ALMA", clue: "Espíritu" }
      ]
    }
  },
  {
    title: "Nivel 2: Fácil",
    size: { rows: 6, cols: 6 },
    bank: {
      across: [
        { answer: "CASA", clue: "Vivienda" },
        { answer: "PERRO", clue: "Animal doméstico" },
        { answer: "GATO", clue: "Felino" },
        { answer: "PATO", clue: "Ave acuática" },
        { answer: "RANA", clue: "Anfibio saltador" },
        { answer: "LOBO", clue: "Animal salvaje" }
      ],
      down: [
        { answer: "CABAL", clue: "Relativo al caballo" },
        { answer: "ARPA", clue: "Instrumento de cuerda" },
        { answer: "OTOÑO", clue: "Estación del año" },
        { answer: "VERANO", clue: "Estación calurosa" },
        { answer: "INVIERNO", clue: "Estación fría" }
      ]
    }
  },
  {
    title: "Nivel 3: Intermedio",
    size: { rows: 8, cols: 8 },
    bank: {
      across: [
        { answer: "BICICLETA", clue: "Vehículo de dos ruedas" },
        { answer: "ESCUELA", clue: "Centro de enseñanza" },
        { answer: "LIBRETA", clue: "Cuaderno pequeño" },
        { answer: "LAPICERO", clue: "Instrumento para escribir" },
        { answer: "MADERA", clue: "Material de los árboles" },
        { answer: "VENTANA", clue: "Abertura en la pared" }
      ],
      down: [
        { answer: "BOTE", clue: "Embarcación pequeña" },
        { answer: "LAPIZ", clue: "Instrumento de escritura" },
        { answer: "CUADERNO", clue: "Conjunto de hojas" },
        { answer: "MESA", clue: "Mueble con tablero" },
        { answer: "SILLA", clue: "Mueble para sentarse" }
      ]
    }
  },
  {
    title: "Nivel 4: Avanzado",
    size: { rows: 10, cols: 10 },
    bank: {
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
    bank: {
      across: [
        { answer: "ARQUITECTURA", clue: "Arte de construir edificios" },
        { answer: "BIOLOGIA", clue: "Ciencia de la vida" },
        { answer: "CHOCOLATE", clue: "Dulce hecho de cacao" },
        { answer: "DICCIONARIO", clue: "Libro con definiciones" },
        { answer: "ECONOMIA", clue: "Ciencia de la administración" }
      ],
      down: [
        { answer: "ALGEBRA", clue: "Rama de las matemáticas" },
        { answer: "BOTANICA", clue: "Ciencia de las plantas" },
        { answer: "CINE", clue: "Arte de las películas" },
        { answer: "DANZA", clue: "Arte de bailar" },
        { answer: "ESCULTURA", clue: "Arte de modelar figuras" }
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
  els.entryText.textContent = entry ? `Pista ${entryNumber}: "${entry.clue}" (Letra ${indexInEntry + 1})` : '—';
}

/* ========= RENDERIZADO DE PISTAS ========= */
function renderClues() {
  els.cluesAcross.innerHTML = '';
  els.cluesDown.innerHTML = '';

  if (!cw || !cw.entries) {
    const empty = document.createElement('div');
    empty.className = 'clueItem';
    empty.style.color = 'var(--muted)';
    empty.textContent = 'Cargando pistas...';
    els.cluesAcross.appendChild(empty.cloneNode(true));
    els.cluesDown.appendChild(empty);
    return;
  }

  const across = cw.entries.across || [];
  const down = cw.entries.down || [];

  if (across.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'clueItem';
    empty.style.color = 'var(--muted)';
    empty.textContent = 'No hay pistas horizontales';
    els.cluesAcross.appendChild(empty);
  } else {
    for (const e of across) {
      const div = document.createElement('div');
      div.className = 'clueItem';
      div.style.cursor = 'pointer';
      div.innerHTML = `<span class="n">${e.number}.</span><span class="t">${e.clue}</span>`;
      div.addEventListener('click', () => selectCell(e.row, e.col, 'across'));
      els.cluesAcross.appendChild(div);
    }
  }

  if (down.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'clueItem';
    empty.style.color = 'var(--muted)';
    empty.textContent = 'No hay pistas verticales';
    els.cluesDown.appendChild(empty);
  } else {
    for (const e of down) {
      const div = document.createElement('div');
      div.className = 'clueItem';
      div.style.cursor = 'pointer';
      div.innerHTML = `<span class="n">${e.number}.</span><span class="t">${e.clue}</span>`;
      div.addEventListener('click', () => selectCell(e.row, e.col, 'down'));
      els.cluesDown.appendChild(div);
    }
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
  const total = LEVEL_BANKS.length;
  currentLevelIndex = ((index % total) + total) % total;
  localStorage.setItem('cw_current_level_index', currentLevelIndex);

  const def = LEVEL_BANKS[currentLevelIndex];
  const { rows, cols } = def.size;

  // Intentar generar el crucigrama
  let generated = null;
  try {
    generated = generateCrossword(def.bank.across, def.bank.down, rows, cols);
  } catch (e) {
    console.warn('Error generando crucigrama:', e);
  }

  // Si falló o no tiene suficientes pistas, usar fallback manual
  if (!generated || generated.entries.across.length === 0 || generated.entries.down.length === 0) {
    console.warn('Usando fallback manual');
    // Crear un crucigrama simple manualmente
    const grid = Array.from({ length: rows }, () => Array(cols).fill('#'));
    const entries = { across: [], down: [] };
    let num = 1;
    
    // Usar las primeras palabras horizontales
    const fallbackAcross = def.bank.across.slice(0, Math.min(3, def.bank.across.length));
    for (let i = 0; i < fallbackAcross.length; i++) {
      const word = fallbackAcross[i];
      if (word.answer.length <= cols && i < rows) {
        for (let j = 0; j < word.answer.length; j++) {
          grid[i][j] = word.answer[j];
        }
        entries.across.push({
          number: num++,
          row: i,
          col: 0,
          answer: word.answer,
          clue: word.clue
        });
      }
    }
    
    // Usar las primeras palabras verticales
    const fallbackDown = def.bank.down.slice(0, Math.min(3, def.bank.down.length));
    let downRow = 0;
    for (let i = 0; i < fallbackDown.length; i++) {
      const word = fallbackDown[i];
      if (word.answer.length <= rows && downRow + word.answer.length <= rows) {
        for (let j = 0; j < word.answer.length; j++) {
          if (grid[downRow + j][cols - 1] === '#') {
            grid[downRow + j][cols - 1] = word.answer[j];
          }
        }
        entries.down.push({
          number: num++,
          row: downRow,
          col: cols - 1,
          answer: word.answer,
          clue: word.clue
        });
        downRow += word.answer.length + 1;
      }
    }
    
    generated = {
      grid: grid.map(row => row.join('')),
      entries: entries
    };
  }

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

  // Seleccionar primera celda editable
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

window
