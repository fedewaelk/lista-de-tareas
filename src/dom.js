import { projects } from './data.js';

export function renderProjects() {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';

  const specialProjects = [
    { name: 'Upcoming', type: 'special', specialName: 'upcoming' },
    { name: 'Completed', type: 'special', specialName: 'completed' }
  ];
  specialProjects.forEach(proj => {
    const li = document.createElement('li');
    li.textContent = proj.name;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      const event = new CustomEvent('projectSelected', {
        detail: { type: 'special', specialName: proj.specialName }
      });
      document.dispatchEvent(event);
    });
    projectsList.appendChild(li);
  });

  projects.forEach((project, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = project.name;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      const event = new CustomEvent('projectSelected', {
        detail: { type: 'project', index }
      });
      document.dispatchEvent(event);
    });
    li.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.classList.add('delete-btn');
    delBtn.style.marginLeft = '10px';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const event = new CustomEvent('projectDelete', { detail: { index } });
      document.dispatchEvent(event);
    });
    li.appendChild(delBtn);

    projectsList.appendChild(li);
  });
}

export function renderTasks(title, tasks) {
    const titleEl = document.getElementById('current-project-title');
    titleEl.textContent = title;
  
    const todosList = document.getElementById('todos-list');
    todosList.innerHTML = '';
  
    tasks.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('task-item');
      
        // Creamos el checkbox custom.
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        // Eliminamos la apariencia nativa.
        checkbox.style.appearance = 'none';
        checkbox.style.webkitAppearance = 'none';
        checkbox.style.mozAppearance = 'none';
        checkbox.style.width = '20px';
        checkbox.style.height = '20px';
        checkbox.style.outline = 'none';
        checkbox.style.borderRadius = '3px';
        checkbox.style.cursor = 'pointer';
        checkbox.style.backgroundRepeat = 'no-repeat';
        checkbox.style.backgroundPosition = 'center';
        checkbox.style.backgroundSize = '80%';
      
        // Función para obtener colores según la prioridad.
        function getPriorityColors(priority) {
          if (priority === 'Low') {
            return { border: 'blue', transparent: 'rgba(0, 0, 255, 0.3)' };
          } else if (priority === 'Medium') {
            return { border: 'orange', transparent: 'rgba(255, 165, 0, 0.3)' };
          } else if (priority === 'High') {
            return { border: 'red', transparent: 'rgba(255, 0, 0, 0.3)' };
          }
        }
        const colors = getPriorityColors(todo.priority);
        checkbox.style.border = `3px solid ${colors.border}`;
        checkbox.style.backgroundColor = checkbox.checked ? colors.border : colors.transparent;
      
        // Definimos el SVG del check blanco.
        const svgCheckWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white">
          <path d="M6.173 11.414l-3.883-3.883 1.414-1.414 2.469 2.47 5.883-5.883 1.414 1.414z"/>
        </svg>`;
      
        // Función que actualiza el backgroundImage según el estado.
        function updateCheckboxBackground() {
          if (checkbox.checked) {
            checkbox.style.backgroundColor = colors.border;
            // Generamos la URL de datos para el SVG.
            const svgWhiteURL = 'data:image/svg+xml,' + encodeURIComponent(svgCheckWhite);
            checkbox.style.backgroundImage = `url("${svgWhiteURL}")`;
          } else {
            checkbox.style.backgroundColor = colors.transparent;
            checkbox.style.backgroundImage = '';
          }
        }
        updateCheckboxBackground();
      
        // Listener para el toggle.
        checkbox.addEventListener('change', () => {
          updateCheckboxBackground();
          const event = new CustomEvent('todoToggle', {
            detail: {
              projectIndex: todo.projectIndex,
              taskIndex: todo.taskIndex,
              completed: checkbox.checked
            }
          });
          document.dispatchEvent(event);
        });
        li.appendChild(checkbox);
      
        // Contenedor de información (solo título y fecha).
        const info = document.createElement('span');
        info.classList.add('task-info');
        info.textContent = `${todo.title} - ${todo.dueDate ? todo.dueDate : ''}`;
        li.appendChild(info);
      
        // Botón de borrado.
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.classList.add('delete-btn');
        delBtn.addEventListener('click', () => {
          const event = new CustomEvent('todoDelete', {
            detail: { projectIndex: todo.projectIndex, taskIndex: todo.taskIndex }
          });
          document.dispatchEvent(event);
        });
        li.appendChild(delBtn);
      
        todosList.appendChild(li);
      });
      
      
  }
  
