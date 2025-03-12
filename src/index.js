import "./styles.css";
import { projects, loadProjects, addProject, addTodo, setCurrentProjectIndex, currentProjectIndex } from './data.js';
import { renderProjects, renderCurrentProject } from './dom.js';

function init() {
  loadProjects();
  renderProjects();
  renderCurrentProject(projects[currentProjectIndex]);
}

// Agregar nuevo proyecto
document.getElementById('add-project-btn').addEventListener('click', () => {
  const projectInput = document.getElementById('new-project-input');
  addProject(projectInput.value);
  projectInput.value = '';
  renderProjects();
});

// Agregar nueva tarea
document.getElementById('add-todo-btn').addEventListener('click', () => {
  const todoInput = document.getElementById('new-todo-input');
  addTodo(todoInput.value);
  todoInput.value = '';
  renderCurrentProject(projects[currentProjectIndex]);
});

document.addEventListener('projectSelected', (e) => {
  setCurrentProjectIndex(e.detail.index);
  renderCurrentProject(projects[currentProjectIndex]);
});

init();
