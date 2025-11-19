// scene.js
// Control del menú + contenido dinámico

console.log("My Cyber Office - WebXR cargado correctamente");

AFRAME.registerComponent('left-screen-controller', {
  schema: {
    menu: { type: 'selector' },
    label: { type: 'selector' }
  },

  init: function () {
    const label   = this.data.label;
    const content = document.querySelector('#left-screen-content');

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
      }

      if (modeText === 'Browser') {
        content.setAttribute('value',
          "Browser de trabajo:\n" +
          "- Usa esta pantalla para notas.\n" +
          "- En Quest abre el navegador real\n" +
          "  para páginas externas."
        );
      }

      if (modeText === 'To-Do') {
        content.setAttribute('value',
          "Lista de tareas:\n" +
          "[ ] Llamar al cliente 1\n" +
          "[ ] Enviar email importante\n" +
          "[ ] Revisar agenda de mañana"
        );
      }
    };

    document.querySelector('#btn-left-calendar')
      .addEventListener('click', () => setMode('Calendario'));

    document.querySelector('#btn-left-browser')
      .addEventListener('click', () => setMode('Browser'));

    document.querySelector('#btn-left-todo')
      .addEventListener('click', () => setMode('To-Do'));

    // Modo inicial
    setMode('To-Do');
  }
});
