import "./styles.css";
import {
  projects,
  loadProjects,
  addProject,
  addTodo,
  setCurrentProjectIndex,
  updateTodoCompletion,
  deleteProject,
  deleteTodo,
  getUpcomingTasks,
  getCompletedTasks
} from './data.js';
import { renderProjects, renderTasks } from './dom.js';

let currentView = { type: 'special', name: 'upcoming' };

function init() {
  loadProjects();
  renderProjects();
  currentView = { type: 'special', name: 'upcoming' };
  renderTasks('Upcoming Tasks', getUpcomingTasks());
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
      renderTasks('Upcoming Tasks', getUpcomingTasks());
    } else if (e.detail.specialName === 'completed') {
      renderTasks('Completed Tasks', getCompletedTasks());
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
      renderTasks('Upcoming Tasks', getUpcomingTasks());
    } else if (currentView.name === 'completed') {
      renderTasks('Completed Tasks', getCompletedTasks());
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

document.addEventListener('projectDelete', (e) => {
  deleteProject(e.detail.index);
  renderProjects();
  if (currentView.type === 'project' && currentView.index === e.detail.index) {
    currentView = { type: 'special', name: 'upcoming' };
    document.getElementById('todo-form').style.display = 'none';
    renderTasks('Upcoming Tasks', getUpcomingTasks());
  } else if (currentView.type === 'project' && currentView.index > e.detail.index) {
    currentView.index = currentView.index - 1;
  }
});

document.addEventListener('todoDelete', (e) => {
  deleteTodo(e.detail.projectIndex, e.detail.taskIndex);
  if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      renderTasks('Upcoming Tasks', getUpcomingTasks());
    } else if (currentView.name === 'completed') {
      renderTasks('Completed Tasks', getCompletedTasks());
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
