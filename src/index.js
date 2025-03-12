import "./styles.css";
// src/main.js
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

let currentView = { type: 'special', name: 'upcoming' }; // default view is Upcoming

// Function to sort tasks by dueDate (ascending) with tasks lacking date at the end.
function sortTasksByDueDate(tasks) {
  return tasks.sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : null;
    const dateB = b.dueDate ? new Date(b.dueDate) : null;
    
    if (!dateA && dateB) return 1;
    if (dateA && !dateB) return -1;
    if (!dateA && !dateB) return 0;
    
    return dateA - dateB;
  });
}

// Listen for project selection.
document.addEventListener('projectSelected', (e) => {
  if (e.detail.type === 'special') {
    currentView = { type: 'special', name: e.detail.specialName };
    document.getElementById('add-task-btn').style.display = 'none';
    if (e.detail.specialName === 'upcoming') {
      let tasks = getUpcomingTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Upcoming Tasks', tasks);
    } else if (e.detail.specialName === 'completed') {
      let tasks = getCompletedTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Completed Tasks', tasks);
    }
  } else if (e.detail.type === 'project') {
    currentView = { type: 'project', index: e.detail.index };
    setCurrentProjectIndex(e.detail.index); // Actualiza el índice global
    document.getElementById('add-task-btn').style.display = 'block';
    const tasks = projects[e.detail.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: e.detail.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[e.detail.index].name} Tasks`, sortTasksByDueDate(tasks));
  }
});

function init() {
  loadProjects();
  renderProjects();
  currentView = { type: 'special', name: 'upcoming' };
  let tasks = getUpcomingTasks();
  tasks = sortTasksByDueDate(tasks);
  renderTasks('Upcoming Tasks', tasks);
  // Hide modal forms initially.
  document.getElementById('project-modal').style.display = 'none';
  document.getElementById('task-modal').style.display = 'none';
}

// --- MODAL LOGIC ---

// Get modal elements.
const projectModal = document.getElementById('project-modal');
const taskModal = document.getElementById('task-modal');

// Open modals when clicking the buttons.
document.getElementById('add-project-btn').addEventListener('click', () => {
  projectModal.style.display = 'block';
});
document.getElementById('add-task-btn').addEventListener('click', () => {
  // Only allow adding tasks if in a custom project view.
  if (currentView.type === 'project') {
    taskModal.style.display = 'block';
  } else {
    alert('Please select a custom project to add tasks.');
  }
});

// Close buttons in modals.
document.getElementById('close-project-modal').addEventListener('click', () => {
  projectModal.style.display = 'none';
});
document.getElementById('close-task-modal').addEventListener('click', () => {
  taskModal.style.display = 'none';
});

// When clicking outside the modal, se cierra.
window.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.style.display = 'none';
  }
  if (e.target === taskModal) {
    taskModal.style.display = 'none';
  }
});

// Add new project from modal.
document.getElementById('modal-add-project-btn').addEventListener('click', () => {
  const input = document.getElementById('modal-project-input');
  addProject(input.value);
  input.value = '';
  renderProjects();
  projectModal.style.display = 'none';
});

// Add new task from modal.
document.getElementById('modal-add-task-btn').addEventListener('click', () => {
  if (currentView.type !== 'project') return;
  const title = document.getElementById('modal-task-title').value;
  const description = document.getElementById('modal-task-desc').value;
  const dueDate = document.getElementById('modal-task-due').value;
  const priority = document.getElementById('modal-task-priority').value;
  addTodo({ title, description, dueDate, priority });
  // Reset modal inputs.
  document.getElementById('modal-task-title').value = '';
  document.getElementById('modal-task-desc').value = '';
  document.getElementById('modal-task-due').value = '';
  document.getElementById('modal-task-priority').value = 'Medium';
  // Update view.
  const tasks = projects[currentView.index].todos.map((todo, idx) => ({
    ...todo,
    projectIndex: currentView.index,
    taskIndex: idx
  }));
  renderTasks(`${projects[currentView.index].name} Tasks`, sortTasksByDueDate(tasks));
  taskModal.style.display = 'none';
});

// --- Resto de la lógica (selección de proyecto, toggle, delete, etc.) ---

// Listen for project selection.
document.addEventListener('projectSelected', (e) => {
  if (e.detail.type === 'special') {
    currentView = { type: 'special', name: e.detail.specialName };
    // Hide add-task modal button in special views.
    document.getElementById('add-task-btn').style.display = 'none';
    if (e.detail.specialName === 'upcoming') {
      let tasks = getUpcomingTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Upcoming Tasks', tasks);
    } else if (e.detail.specialName === 'completed') {
      let tasks = getCompletedTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Completed Tasks', tasks);
    }
  } else if (e.detail.type === 'project') {
    currentView = { type: 'project', index: e.detail.index };
    // Show the Add Task button when in custom project view.
    document.getElementById('add-task-btn').style.display = 'block';
    const tasks = projects[e.detail.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: e.detail.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[e.detail.index].name} Tasks`, sortTasksByDueDate(tasks));
  }
});

// Listen for toggling a task's completed status.
document.addEventListener('todoToggle', (e) => {
  updateTodoCompletion(e.detail.projectIndex, e.detail.taskIndex, e.detail.completed);
  if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      let tasks = getUpcomingTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.name === 'completed') {
      let tasks = getCompletedTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Completed Tasks', tasks);
    }
  } else if (currentView.type === 'project') {
    const tasks = projects[currentView.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: currentView.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[currentView.index].name} Tasks`, sortTasksByDueDate(tasks));
  }
});

// Listen for deleting a project.
document.addEventListener('projectDelete', (e) => {
  deleteProject(e.detail.index);
  renderProjects();
  if (currentView.type === 'project' && currentView.index === e.detail.index) {
    currentView = { type: 'special', name: 'upcoming' };
    document.getElementById('add-task-btn').style.display = 'none';
    let tasks = getUpcomingTasks();
    tasks = sortTasksByDueDate(tasks);
    renderTasks('Upcoming Tasks', tasks);
  } else if (currentView.type === 'project' && currentView.index > e.detail.index) {
    currentView.index = currentView.index - 1;
  }
});

// Listen for deleting a task.
document.addEventListener('todoDelete', (e) => {
  deleteTodo(e.detail.projectIndex, e.detail.taskIndex);
  if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      let tasks = getUpcomingTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.name === 'completed') {
      let tasks = getCompletedTasks();
      tasks = sortTasksByDueDate(tasks);
      renderTasks('Completed Tasks', tasks);
    }
  } else if (currentView.type === 'project') {
    const tasks = projects[currentView.index].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: currentView.index,
      taskIndex: idx
    }));
    renderTasks(`${projects[currentView.index].name} Tasks`, sortTasksByDueDate(tasks));
  }
});

init();
