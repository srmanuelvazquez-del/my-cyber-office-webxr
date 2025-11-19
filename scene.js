// scene.js
// Menú de modos + lista To-Do interactiva

console.log("My Cyber Office - WebXR cargado correctamente");

// Estado de las tareas (false = pendiente, true = completada)
const todoState = [false, false, false];
const todoTexts = [
  "Llamar al cliente 1",
  "Enviar email importante",
  "Revisar agenda de mañana"
];

// Construye el texto que se ve en la pantalla para To-Do
function buildTodoText() {
  let lines = ["Lista de tareas:"];
  for (let i = 0; i < todoState.length; i++) {
    const check = todoState[i] ? "[X]" : "[ ]";
    lines.push(`${check} ${todoTexts[i]}`);
  }
  return lines.join("\n");
}

AFRAME.registerComponent('left-screen-controller', {
  schema: {
    menu:  { type: 'selector' },
    label: { type: 'selector' }
  },

  init: function () {
    const label   = this.data.label;
    const content = document.querySelector('#left-screen-content');

    if (!label || !content) {
      console.warn("left-screen-controller: falta label o content");
      return;
    }

    const setMode = (modeText) => {
      // Título
      label.setAttribute('value', `Utilidades: ${modeText}`);

      // Contenido según modo
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

    // Botones del menú
    const btnCalendar = document.querySelector('#btn-left-calendar');
    const btnBrowser  = document.querySelector('#btn-left-browser');
    const btnTodo     = document.querySelector('#btn-left-todo');

    if (btnCalendar) {
      btnCalendar.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('Calendario');
      });
    }

    if (btnBrowser) {
      btnBrowser.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('Browser');
      });
    }

    if (btnTodo) {
      btnTodo.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setMode('To-Do');
      });
    }

    // Modo inicial
    setMode('To-Do');
  }
});

// Componente para cada tarea clicable
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

      // Cambiar estado de la tarea
      todoState[idx] = !todoState[idx];

      // Forzar modo To-Do
      if (label) {
        label.setAttribute('value', 'Utilidades: To-Do');
      }

      // Actualizar texto
      content.setAttribute('value', buildTodoText());

      console.log("Tarea", idx, "nuevo estado:", todoState[idx]);
    });
  }
});
