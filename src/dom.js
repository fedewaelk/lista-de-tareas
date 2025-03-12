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
    delBtn.textContent = 'Delete';
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

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
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

    const details = document.createElement('div');
    details.style.display = 'inline-block';
    details.style.marginLeft = '10px';
    details.innerHTML = `<strong>${todo.title}</strong><br>
                         ${todo.description}<br>
                         Due: ${todo.dueDate} | Priority: ${todo.priority}`;
    li.appendChild(details);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.style.marginLeft = '10px';
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
