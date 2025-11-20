// scene.js
// Menú desplegable + modos + To-Do + teclado virtual + navegador interno

console.log("My Cyber Office - WebXR cargado correctamente");

// -------- ESTADO TO-DO --------
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

// -------- ESTADO TECLADO --------
let centerInputText = "";

// -------- ESTADO NAVEGADOR DERECHO --------
let currentBrowserUrl = "https://www.google.com";

const browserPages = {
  google: {
    title: "Navegador: Google",
    body:  "Simulación de Google.\nUsa este panel para pensar tus búsquedas.\nURL: https://www.google.com",
    url:   "https://www.google.com"
  },
  youtube: {
    title: "Navegador: YouTube",
    body:  "Simulación de YouTube.\nOrganiza aquí qué videos verás para tu negocio.\nURL: https://www.youtube.com",
    url:   "https://www.youtube.com"
  },
  vitalhealth: {
    title: "Navegador: Vital Health",
    body:  "Panel de trabajo para Vital Health.\nImagina aquí tu backoffice, ventas y clientes.\nURL: https://vitalhealth.com (ejemplo)",
    url:   "https://vitalhealth.com"
  },
  gmail: {
    title: "Navegador: Gmail",
    body:  "Simulación de tu correo Gmail.\nÚsalo como recordatorio de emails importantes.\nURL: https://mail.google.com",
    url:   "https://mail.google.com"
  },
  chatgpt: {
    title: "Navegador: ChatGPT",
    body:  "Simulación de ChatGPT.\nAquí planificas qué le vas a preguntar a Clarie.\nURL: https://chat.openai.com",
    url:   "https://chat.openai.com"
  }
};

function setRightBrowserPage(pageKey) {
  const data = browserPages[pageKey];
  if (!data) {
    console.warn("Página de navegador no encontrada:", pageKey);
    return;
  }

  const titleEl = document.querySelector('#right-browser-title');
  const bodyEl  = document.querySelector('#right-browser-body');

  if (titleEl) titleEl.setAttribute('value', data.title);
  if (bodyEl)  bodyEl.setAttribute('value', data.body);

  currentBrowserUrl = data.url;
  console.log("Navegador cambió a:", pageKey, "URL:", currentBrowserUrl);
}

// -------- CONTROL PANTALLA IZQUIERDA --------
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
          "Browser de trabajo (texto):\n" +
          "- Escribe aquí notas rápidas.\n" +
          "- Usa la pantalla derecha para el navegador visual."
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

    // Navegador derecho modo inicial
    setRightBrowserPage('google');
  }
});

// -------- BOTÓN ⧉ (MENU-TOGGLE IZQUIERDO) --------
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
      console.log("Menú izquierdo ahora:", next ? "VISIBLE" : "OCULTO");
    });
  }
});

// -------- TAREAS CLICABLES --------
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

// -------- TECLAS DEL TECLADO --------
AFRAME.registerComponent('key-button', {
  schema: {
    char: { type: 'string' }
  },

  init: function () {
    const ch = this.data.char;
    const el = this.el;
    const output = document.querySelector('#center-input');

    if (!output) {
      console.warn("key-button: no se encontró #center-input");
      return;
    }

    // Visual
    el.setAttribute('color', '#223b76');
    el.setAttribute('material', 'shader: flat');

    const labelEl = document.createElement('a-text');
    let labelChar = ch;
    if (ch === 'SPACE') labelChar = 'Espacio';
    if (ch === 'BACKSPACE') labelChar = '⌫';
    labelEl.setAttribute('value', labelChar);
    labelEl.setAttribute('align', 'center');
    labelEl.setAttribute('color', '#ffffff');
    labelEl.setAttribute('width', 1.5);
    labelEl.setAttribute('position', '0 0 0.01');
    el.appendChild(labelEl);

    const updateOutput = () => {
      output.setAttribute('value', 'Entrada: ' + centerInputText);
    };

    el.addEventListener('click', (evt) => {
      evt.stopPropagation();

      if (ch === 'SPACE') {
        centerInputText += ' ';
      } else if (ch === 'BACKSPACE') {
        centerInputText = centerInputText.slice(0, -1);
      } else {
        centerInputText += ch;
      }

      updateOutput();
      console.log("Texto actual:", centerInputText);
    });
  }
});

// -------- BOTONES DEL NAVEGADOR DERECHO --------
AFRAME.registerComponent('browser-link', {
  schema: {
    page: { type: 'string' }
  },

  init: function () {
    const pageKey = this.data.page;
    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      setRightBrowserPage(pageKey);
    });
  }
});

// -------- BOTÓN ABRIR EN NAVEGADOR REAL --------
AFRAME.registerComponent('open-external', {
  init: function () {
    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (currentBrowserUrl) {
        try {
          window.open(currentBrowserUrl, '_blank');
        } catch (e) {
          console.warn("No se pudo abrir ventana externa:", e);
        }
        console.log("Solicitado abrir externamente:", currentBrowserUrl);
      }
    });
  }
});
