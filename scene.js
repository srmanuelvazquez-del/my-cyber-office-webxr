// scene.js
// Menú desplegable + modos + To-Do interactivo + teclado virtual

console.log("My Cyber Office - WebXR cargado correctamente");

// ---------- ESTADO TO-DO ----------
const todoState = [false, false, false];
const todoTexts = [
  "Llamar al cliente 1",
  "Enviar email importante",
  "Revisar agenda de mañana"
];

function buildTodoText() {
  let lines = ["Lista de tareas:"];
  for (let i = 0; i < todoState.length; i++) {
    const check = todoState[i] ? "[X]" : "[ ]";
    lines.push(`${check} ${todoTexts[i]}`);
  }
  return lines.join("\n");
}

// ---------- ESTADO TECLADO ----------
let inputBuffer = "";

function updateInputText() {
  const txt = document.querySelector('#input-text');
  if (!txt) return;
  if (inputBuffer.length === 0) {
    txt.setAttribute('value', "Escribe aquí con el teclado virtual...");
  } else {
    txt.setAttribute('value', inputBuffer);
  }
}

// ---------- CONTROL PANTALLA IZQUIERDA ----------
AFRAME.registerComponent('left-screen-controller', {
  schema: {
    label: { type: 'selector' }
  },

  init: function () {
    const label   = this.data.label;
    const content = document.querySelector('#left-screen-content');
    const menu    = document.querySelector('#left-menu');

    if (!label || !content) {
      console.warn("left-screen-controller: falta label o content");
      return;
    }

    const setMode = (modeText) => {
      label.setAttribute('value', `Utilidades: ${modeText}`);

      if (modeText === 'Calendario') {
        content.setAttribute('value',
          "Calendario (Ejemplo):\n" +
          "L M M J V S D\n" +
          "1 2 3 4 5 6 7\n" +
          "8 9 10 11 12 13 14\n" +
          "15 16 17 18 19 20 21\n" +
          "22 23 24 25 26 27 28"
        );
      } else if (modeText === 'Browser') {
        content.setAttribute('value',
          "Browser de trabajo:\n" +
          "- Usa esta pantalla para notas.\n" +
          "- En Quest abre el navegador real\n" +
          "  para páginas externas."
        );
      } else if (modeText === 'To-Do') {
        content.setAttribute('value', buildTodoText());
      }

      console.log("Pantalla izquierda modo:", modeText);
    };

    const hideMenu = () => {
      if (menu) menu.setAttribute('visible', false);
    };

    const btnCalendar = document.querySelector('#btn-left-calendar');
    const btnBrowser  = document.querySelector('#btn-left-browser');
    const btnTodo     = document.querySelector('#btn-left-todo');

    if (btnCalendar) {
      btnCalendar.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('Calendario');
        hideMenu();
      });
    }

    if (btnBrowser) {
      btnBrowser.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('Browser');
        hideMenu();
      });
    }

    if (btnTodo) {
      btnTodo.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('To-Do');
        hideMenu();
      });
    }

    // Modo inicial
    setMode('To-Do');
  }
});

// ---------- BOTÓN FUTURISTA ⧉ (MOSTRAR/OCULTAR MENÚ) ----------
AFRAME.registerComponent('menu-toggle', {
  init: function () {
    const menu = document.querySelector('#left-menu');
    if (!menu) {
      console.warn("menu-toggle: no se encontró #left-menu");
      return;
    }

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      const isVisible = menu.getAttribute('visible');
      const next = !isVisible;
      menu.setAttribute('visible', next);
      console.log("Menú ahora:", next ? "VISIBLE" : "OCULTO");
    });
  }
});

// ---------- TAREAS CLICABLES ----------
AFRAME.registerComponent('todo-item', {
  schema: {
    index: { type: 'int' }
  },

  init: function () {
    const idx = this.data.index;
    const el  = this.el;

    const label   = document.querySelector('#left-screen-label');
    const content = document.querySelector('#left-screen-content');

    if (idx < 0 || idx >= todoState.length || !content) {
      console.warn("todo-item mal configurado");
      return;
    }

    el.addEventListener('click', (evt) => {
      evt.stopPropagation();

      todoState[idx] = !todoState[idx];

      if (label) {
        label.setAttribute('value', 'Utilidades: To-Do');
      }

      content.setAttribute('value', buildTodoText());
      console.log("Tarea", idx, "nuevo estado:", todoState[idx]);
    });
  }
});

// ---------- TECLADO VIRTUAL ----------
AFRAME.registerComponent('vk-key', {
  schema: {
    char:   { type: 'string', default: '' },
    action: { type: 'string', default: '' }
  },

  init: function () {
    const data = this.data;

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();

      if (data.action === 'backspace') {
        inputBuffer = inputBuffer.slice(0, -1);
      } else if (data.action === 'space') {
        inputBuffer += ' ';
      } else if (data.char) {
        inputBuffer += data.char;
      }

      updateInputText();
      console.log("Input actual:", inputBuffer);
    });
  }
});

// Inicializar texto del teclado al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateInputText();
});
