import "./styles.css";
import {
  projects,
  loadProjects,
  addProject,
  addTodo,
  setCurrentProjectIndex,
  updateTodoCompletion,
  getUpcomingTasks,
  getCompletedTasks
} from './data.js';
import { renderProjects, renderTasks } from './dom.js';

let currentView = { type: 'special', name: 'upcoming' };

function init() {
  loadProjects();
  renderProjects();
  currentView = { type: 'special', name: 'upcoming' };
  const tasks = getUpcomingTasks();
  renderTasks('Upcoming Tasks', tasks);
  document.getElementById('todo-form').style.display = 'none';
}

document.getElementById('add-project-btn').addEventListener('click', () => {
  const projectInput = document.getElementById('new-project-input');
  addProject(projectInput.value);
  projectInput.value = '';
  renderProjects();
});

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentView.type !== 'project') return;
  const title = document.getElementById('todo-title-input').value;
  const description = document.getElementById('todo-desc-input').value;
  const dueDate = document.getElementById('todo-due-input').value;
  const priority = document.getElementById('todo-priority-input').value;
  addTodo({ title, description, dueDate, priority });
  document.getElementById('todo-form').reset();
  const tasks = projects[currentView.index].todos.map((todo, idx) => ({
    ...todo,
    projectIndex: currentView.index,
    taskIndex: idx
  }));
  renderTasks(`${projects[currentView.index].name} Tasks`, tasks);
});

document.addEventListener('projectSelected', (e) => {
  if (e.detail.type === 'special') {
    currentView = { type: 'special', name: e.detail.specialName };
    document.getElementById('todo-form').style.display = 'none';
    if (e.detail.specialName === 'upcoming') {
      const tasks = getUpcomingTasks();
      renderTasks('Upcoming Tasks', tasks);
    } else if (e.detail.specialName === 'completed') {
      const tasks = getCompletedTasks();
      renderTasks('Completed Tasks', tasks);
    }
  } else if (e.detail.type === 'project') {
    currentView = { type: 'project', index: e.detail.index };
    document.getElementById('todo-form').style.display = 'block';
    const tasks = projects[e.detail.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: e.detail.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[e.detail.index].name} Tasks`, tasks);
  }
});

document.addEventListener('todoToggle', (e) => {
  updateTodoCompletion(e.detail.projectIndex, e.detail.taskIndex, e.detail.completed);
  if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      const tasks = getUpcomingTasks();
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.name === 'completed') {
      const tasks = getCompletedTasks();
      renderTasks('Completed Tasks', tasks);
    }
  } else if (currentView.type === 'project') {
    const tasks = projects[currentView.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: currentView.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[currentView.index].name} Tasks`, tasks);
  }
});

init();
