// scene.js
// Lógica de la pantalla izquierda + menú

console.log("My Cyber Office - WebXR inicial cargado correctamente");

AFRAME.registerComponent('left-screen-controller', {
  schema: {
    menu: { type: 'selector' },
    label: { type: 'selector' }
  },

  init: function () {
    const screen = this.el;
    const menu = this.data.menu;
    const label = this.data.label;

    if (!menu || !label) {
      console.warn("left-screen-controller: falta menu o label");
      return;
    }

    // Función para cambiar el modo de la pantalla izquierda
    const setMode = (modeText) => {
      label.setAttribute('value', `Utilidades: ${modeText}`);
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
  }
});
