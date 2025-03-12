import "./styles.css";
import { projects, loadProjects, addProject, addTodo, setCurrentProjectIndex, currentProjectIndex } from './data.js';
import { renderProjects, renderCurrentProject } from './dom.js';

function init() {
  loadProjects();
  renderProjects();
  renderCurrentProject(projects[currentProjectIndex]);
}

document.getElementById('add-project-btn').addEventListener('click', () => {
  const projectInput = document.getElementById('new-project-input');
  addProject(projectInput.value);
  projectInput.value = '';
  renderProjects();
});

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('todo-title-input').value;
  const description = document.getElementById('todo-desc-input').value;
  const dueDate = document.getElementById('todo-due-input').value;
  const priority = document.getElementById('todo-priority-input').value;
  addTodo({ title, description, dueDate, priority });
  document.getElementById('todo-form').reset();
  renderCurrentProject(projects[currentProjectIndex]);
});

document.addEventListener('projectSelected', (e) => {
  setCurrentProjectIndex(e.detail.index);
  renderCurrentProject(projects[currentProjectIndex]);
});

init();
