/* ========= GENERADOR DE CRUCIGRAMAS MEJORADO ========= */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateCrossword(wordBankAcross, wordBankDown, maxRows, maxCols) {
  // Filtrar palabras que quepan
  const across = wordBankAcross.filter(w => w.answer.length <= maxCols);
  const down = wordBankDown.filter(w => w.answer.length <= maxRows);
  
  if (across.length === 0 || down.length === 0) {
    throw new Error('No hay palabras disponibles para este tamaño');
  }

  // Seleccionar palabras aleatorias
  const shuffledAcross = shuffle([...across]);
  const shuffledDown = shuffle([...down]);
  
  // Tomar entre 3 y 6 palabras de cada lista según el tamaño
  const numAcross = Math.min(shuffledAcross.length, Math.max(2, Math.floor((maxRows + maxCols) / 4)));
  const numDown = Math.min(shuffledDown.length, Math.max(2, Math.floor((maxRows + maxCols) / 4)));
  
  const selectedAcross = shuffledAcross.slice(0, numAcross);
  const selectedDown = shuffledDown.slice(0, numDown);

  // Crear grid vacía
  const grid = Array.from({ length: maxRows }, () => Array(maxCols).fill(''));
  const placed = [];

  // Colocar palabras horizontales primero (más largas primero)
  const sortedAcross = [...selectedAcross].sort((a, b) => b.answer.length - a.answer.length);
  
  for (const word of sortedAcross) {
    const len = word.answer.length;
    const maxCol = maxCols - len;
    const positions = [];
    
    // Buscar todas las posiciones posibles
    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c <= maxCol; c++) {
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
    
    shuffle(positions);
    if (positions.length === 0) continue;
    
    const pos = positions[0];
    const wordPos = [];
    for (let i = 0; i < len; i++) {
      grid[pos.r][pos.c + i] = word.answer[i];
      wordPos.push({ r: pos.r, c: pos.c + i });
    }
    placed.push({ word, row: pos.r, col: pos.c, dir: 'across', positions: wordPos });
  }

  // Colocar palabras verticales
  const sortedDown = [...selectedDown].sort((a, b) => b.answer.length - a.answer.length);
  
  for (const word of sortedDown) {
    const len = word.answer.length;
    const maxRow = maxRows - len;
    const positions = [];
    
    for (let r = 0; r <= maxRow; r++) {
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
    
    shuffle(positions);
    if (positions.length === 0) continue;
    
    const pos = positions[0];
    const wordPos = [];
    for (let i = 0; i < len; i++) {
      grid[pos.r + i][pos.c] = word.answer[i];
      wordPos.push({ r: pos.r + i, c: pos.c });
    }
    placed.push({ word, row: pos.r, col: pos.c, dir: 'down', positions: wordPos });
  }

  // Si no se colocó nada, usar las primeras palabras
  if (placed.length === 0) {
    // Colocar al menos una horizontal y una vertical
    const fallbackAcross = selectedAcross.slice(0, 2);
    const fallbackDown = selectedDown.slice(0, 2);
    
    for (const word of fallbackAcross) {
      const len = word.answer.length;
      if (len <= maxCols) {
        const wordPos = [];
        for (let i = 0; i < len; i++) {
          grid[0][i] = word.answer[i];
          wordPos.push({ r: 0, c: i });
        }
        placed.push({ word, row: 0, col: 0, dir: 'across', positions: wordPos });
      }
    }
    
    for (const word of fallbackDown) {
      const len = word.answer.length;
      if (len <= maxRows) {
        const wordPos = [];
        for (let i = 0; i < len; i++) {
          if (grid[i][maxCols-1] === '') {
            grid[i][maxCols-1] = word.answer[i];
            wordPos.push({ r: i, c: maxCols-1 });
          }
        }
        if (wordPos.length === len) {
          placed.push({ word, row: 0, col: maxCols-1, dir: 'down', positions: wordPos });
        }
      }
    }
  }

  // Construir la grid final
  const finalGrid = grid.map(row => row.map(cell => (cell === '' ? '#' : cell)).join(''));

  // Generar entries
  const entries = { across: [], down: [] };
  let number = 1;
  
  for (const p of placed) {
    const entry = {
      number: number++,
      row: p.row,
      col: p.col,
      answer: p.word.answer,
      clue: p.word.clue
    };
    if (p.dir === 'across') {
      entries.across.push(entry);
    } else {
      entries.down.push(entry);
    }
  }

  return { grid: finalGrid, entries };
}

/* ========= BANCO DE PALABRAS ========= */
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
        { answer: "AVION", clue: "Medio de transporte aéreo" },
        { answer: "BANCO", clue: "Mueble para sentarse" },
        { answer: "CAMPO", clue: "Terreno extenso" },
        { answer: "DEDO", clue: "Parte de la mano" },
        { answer: "ESTE", clue: "Punto cardinal" }
      ],
      down: [
        { answer: "SAL", clue: "Condimento" },
        { answer: "UNO", clue: "Número uno" },
        { answer: "DOS", clue: "Número dos" },
        { answer: "TRES", clue: "Número tres" },
        { answer: "ALMA", clue: "Espíritu" },
        { answer: "BOCA", clue: "Abertura para comer" },
        { answer: "COLA", clue: "Extremidad de algunos animales" },
        { answer: "DADO", clue: "Cubo con números" }
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
        { answer: "LOBO", clue: "Animal salvaje" },
        { answer: "OSO", clue: "Mamífero grande" },
        { answer: "TORO", clue: "Animal bovino" },
        { answer: "CABRA", clue: "Animal con cuernos" },
        { answer: "ARBOL", clue: "Planta de tronco" },
        { answer: "FLOR", clue: "Parte de la planta" },
        { answer: "PIEDRA", clue: "Roca" }
      ],
      down: [
        { answer: "CABAL", clue: "Relativo al caballo" },
        { answer: "ARPA", clue: "Instrumento de cuerda" },
        { answer: "OTOÑO", clue: "Estación del año" },
        { answer: "VERANO", clue: "Estación calurosa" },
        { answer: "INVIERNO", clue: "Estación fría" },
        { answer: "CUADRO", clue: "Obra de arte" },
        { answer: "MUSICA", clue: "Arte de los sonidos" }
      ]
    }
  },
  {
    title: "Nivel 3: Intermedio",
    size: { rows: 8, cols: 8 },
    bank: {
      across: [
        { answer: "BICICLETA", clue: "Vehículo de dos ruedas" },
        { answer: "TELEVISION", clue: "Aparato que recibe imágenes" },
        { answer: "ESCUELA", clue: "Centro de enseñanza" },
        { answer: "LIBRETA", clue: "Cuaderno pequeño" },
        { answer: "LAPICERO", clue: "Instrumento para escribir" },
        { answer: "MADERA", clue: "Material de los árboles" },
        { answer: "VENTANA", clue: "Abertura en la pared" },
        { answer: "JARDIN", clue: "Terreno con plantas" },
        { answer: "NUBE", clue: "Masa de vapor en el cielo" },
        { answer: "LLUVIA", clue: "Agua que cae del cielo" }
      ],
      down: [
        { answer: "BOTE", clue: "Embarcación pequeña" },
        { answer: "LAPIZ", clue: "Instrumento de escritura" },
        { answer: "CUADERNO", clue: "Conjunto de hojas" },
        { answer: "MESA", clue: "Mueble con tablero" },
        { answer: "SILLA", clue: "Mueble para sentarse" },
        { answer: "PUERTA", clue: "Abertura para entrar" },
        { answer: "PIZARRA", clue: "Superficie para escribir" },
        { answer: "TIZA", clue: "Piedra para escribir" },
        { answer: "REGLA", clue: "Instrumento para medir" }
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
        { answer: "ELEFANTE", clue: "Mamífero con trompa" },
        { answer: "FISICA", clue: "Ciencia de la materia" },
        { answer: "GEOGRAFIA", clue: "Ciencia que estudia la Tierra" },
        { answer: "HISTORIA", clue: "Narración de hechos pasados" },
        { answer: "JUGUETE", clue: "Objeto para divertirse" }
      ],
      down: [
        { answer: "AGUA", clue: "Líquido incoloro" },
        { answer: "BOSQUE", clue: "Lugar con muchos árboles" },
        { answer: "CIELO", clue: "Atmósfera vista desde abajo" },
        { answer: "DIENTE", clue: "Órgano de la boca" },
        { answer: "ESTRELLA", clue: "Cuerpo celeste que brilla" },
        { answer: "FLORIDA", clue: "Estado de EE.UU." },
        { answer: "GITANO", clue: "Persona de etnia gitana" },
        { answer: "HUEVO", clue: "Alimento ovalado" },
        { answer: "ISLA", clue: "Terreno rodeado de agua" }
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
        { answer: "ECONOMIA", clue: "Ciencia de la administración" },
        { answer: "FOTOGRAFIA", clue: "Arte de capturar imágenes" },
        { answer: "GEOGRAFIA", clue: "Ciencia de la Tierra" },
        { answer: "HISTORIA", clue: "Estudio del pasado" },
        { answer: "INFORMATICA", clue: "Ciencia de los datos" }
      ],
      down: [
        { answer: "ALGEBRA", clue: "Rama de las matemáticas" },
        { answer: "BOTANICA", clue: "Ciencia de las plantas" },
        { answer: "CINE", clue: "Arte de las películas" },
        { answer: "DANZA", clue: "Arte de bailar" },
        { answer: "ESCULTURA", clue: "Arte de modelar figuras" },
        { answer: "FISICA", clue: "Ciencia de la materia" },
        { answer: "GEOLOGIA", clue: "Ciencia de la Tierra" }
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
    console.warn('No hay pistas para mostrar');
    return;
  }

  const across = cw.entries.across || [];
  const down = cw.entries.down || [];

  console.log(`📝 Mostrando ${across.length} pistas horizontales y ${down.length} verticales`);

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

  let generated;
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    try {
      generated = generateCrossword(def.bank.across, def.bank.down, rows, cols);
      if (generated && generated.entries.across.length > 0 && generated.entries.down.length > 0) {
        break;
      }
    } catch (e) {
      console.warn(`Intento ${attempts + 1} fallido:`, e.message);
    }
    attempts++;
  }

  if (!generated || generated.entries.across.length === 0 || generated.entries.down.length === 0) {
    // Fallback: usar una configuración simple con las primeras palabras
    console.warn('Usando configuración de respaldo');
    const fallback = def.bank;
    const simpleAcross = fallback.across.slice(0, Math.min(3, fallback.across.length));
    const simpleDown = fallback.down.slice(0, Math.min(3, fallback.down.length));
    
    const grid = Array.from({ length: rows }, () => Array(cols).fill('#'));
    const entries = { across: [], down: [] };
    let num = 1;
    
    // Colocar horizontales en la primera fila
    for (let i = 0; i < simpleAcross.length && i < cols; i++) {
      const word = simpleAcross[i];
      if (word.answer.length <= cols) {
        for (let j = 0; j < word.answer.length; j++) {
          grid[0][j] = word.answer[j];
        }
        entries.across.push({
          number: num++,
          row: 0,
          col: 0,
          answer: word.answer,
          clue: word.clue
        });
      }
    }
    
    // Colocar verticales en la primera columna
    for (let i = 0; i < simpleDown.length && i < rows; i++) {
      const word = simpleDown[i];
      if (word.answer.length <= rows) {
        for (let j = 0; j < word.answer.length; j++) {
          grid[j][0] = word.answer[j];
        }
        entries.down.push({
          number: num++,
          row: 0,
          col: 0,
          answer: word.answer,
          clue: word.clue
        });
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

window.addEventListener('DOMContentLoaded', init);
