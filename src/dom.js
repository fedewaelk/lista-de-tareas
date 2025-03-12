import { projects } from './data.js';

export function renderProjects() {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';
  projects.forEach((project, index) => {
    const li = document.createElement('li');
    li.textContent = project.name;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      const event = new CustomEvent('projectSelected', { detail: { index } });
      document.dispatchEvent(event);
    });
    projectsList.appendChild(li);
  });
}

export function renderCurrentProject(currentProject) {
  const currentProjectTitle = document.getElementById('current-project-title');
  currentProjectTitle.textContent = `Tasks in ${currentProject.name}`;
  
  const todosList = document.getElementById('todos-list');
  todosList.innerHTML = '';
  currentProject.todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.title;
    todosList.appendChild(li);
  });
}
