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
  getCompletedTasks,
  saveProjects
} from './data.js';
import { renderProjects, renderTasks } from './dom.js';

let currentView = { type: 'special', name: 'upcoming' };

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

document.addEventListener('projectSelected', (e) => {
  if (e.detail.type === 'special') {
    currentView = { type: 'special', name: e.detail.specialName };
    document.getElementById('add-task-btn').style.display = 'none';
    if (e.detail.specialName === 'upcoming') {
      let tasks = sortTasksByDueDate(getUpcomingTasks());
      renderTasks('Upcoming Tasks', tasks);
    } else if (e.detail.specialName === 'completed') {
      let tasks = sortTasksByDueDate(getCompletedTasks());
      renderTasks('Completed Tasks', tasks);
    }
  } else if (e.detail.type === 'project') {
    currentView = { type: 'project', index: e.detail.index };
    setCurrentProjectIndex(e.detail.index);
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
  let tasks = sortTasksByDueDate(getUpcomingTasks());
  renderTasks('Upcoming Tasks', tasks);
  document.getElementById('project-modal').style.display = 'none';
  document.getElementById('task-modal').style.display = 'none';
  document.getElementById('edit-task-modal').style.display = 'none';
}

// --- MODAL LOGIC FOR ADDING PROJECTS & TASKS ---
const projectModal = document.getElementById('project-modal');
const taskModal = document.getElementById('task-modal');

document.getElementById('add-project-btn').addEventListener('click', () => {
  projectModal.style.display = 'block';
});
document.getElementById('add-task-btn').addEventListener('click', () => {
  if (currentView.type === 'project') {
    taskModal.style.display = 'block';
  } else {
    alert('Please select a custom project to add tasks.');
  }
});

document.getElementById('close-project-modal').addEventListener('click', () => {
  projectModal.style.display = 'none';
});
document.getElementById('close-task-modal').addEventListener('click', () => {
  taskModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.style.display = 'none';
  }
  if (e.target === taskModal) {
    taskModal.style.display = 'none';
  }
});

document.getElementById('modal-add-project-btn').addEventListener('click', () => {
  const input = document.getElementById('modal-project-input');
  addProject(input.value);
  input.value = '';
  renderProjects();
  projectModal.style.display = 'none';
});

document.getElementById('modal-add-task-btn').addEventListener('click', () => {
  if (currentView.type !== 'project') return;
  const title = document.getElementById('modal-task-title').value.trim();
  if (!title) {
    alert("Task title is required.");
    return;
  }
  const description = document.getElementById('modal-task-desc').value;
  const dueDate = document.getElementById('modal-task-due').value;
  const priority = document.getElementById('modal-task-priority').value;
  addTodo({ title, description, dueDate, priority });
  document.getElementById('modal-task-title').value = '';
  document.getElementById('modal-task-desc').value = '';
  document.getElementById('modal-task-due').value = '';
  document.getElementById('modal-task-priority').value = 'Medium';
  const tasks = projects[currentView.index].todos.map((todo, idx) => ({
    ...todo,
    projectIndex: currentView.index,
    taskIndex: idx
  }));
  renderTasks(`${projects[currentView.index].name} Tasks`, sortTasksByDueDate(tasks));
  taskModal.style.display = 'none';
});

document.addEventListener('todoToggle', (e) => {
  updateTodoCompletion(e.detail.projectIndex, e.detail.taskIndex, e.detail.completed);
  if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      let tasks = sortTasksByDueDate(getUpcomingTasks());
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.name === 'completed') {
      let tasks = sortTasksByDueDate(getCompletedTasks());
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

document.addEventListener('projectDelete', (e) => {
  if (confirm("Are you sure you want to delete this project?")) {
    deleteProject(e.detail.index);
    renderProjects();
    if (currentView.type === 'project' && currentView.index === e.detail.index) {
      currentView = { type: 'special', name: 'upcoming' };
      document.getElementById('add-task-btn').style.display = 'none';
      let tasks = sortTasksByDueDate(getUpcomingTasks());
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.type === 'project' && currentView.index > e.detail.index) {
      currentView.index = currentView.index - 1;
    }
  }
});

document.addEventListener('todoDelete', (e) => {
  if (confirm("Are you sure you want to delete this task?")) {
    deleteTodo(e.detail.projectIndex, e.detail.taskIndex);
    if (currentView.type === 'special') {
      if (currentView.name === 'upcoming') {
        let tasks = sortTasksByDueDate(getUpcomingTasks());
        renderTasks('Upcoming Tasks', tasks);
      } else if (currentView.name === 'completed') {
        let tasks = sortTasksByDueDate(getCompletedTasks());
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
  }
});

// --- EDIT TASK MODAL LOGIC ---
let currentEditProjectIndex = null;
let currentEditTaskIndex = null;
let currentEditTask = null;

document.addEventListener('editTask', (e) => {
  const { projectIndex, taskIndex } = e.detail;
  currentEditProjectIndex = projectIndex;
  currentEditTaskIndex = taskIndex;
  currentEditTask = projects[projectIndex].todos[taskIndex];
  
  document.getElementById('edit-task-title').value = currentEditTask.title;
  document.getElementById('edit-task-desc').value = currentEditTask.description || "";
  document.getElementById('edit-task-due').value = currentEditTask.dueDate || "";
  document.getElementById('edit-task-priority').value = currentEditTask.priority || "Medium";
  
  document.getElementById('edit-task-modal').style.display = 'block';
});

document.getElementById('close-edit-task-modal').addEventListener('click', () => {
  document.getElementById('edit-task-modal').style.display = 'none';
});

document.getElementById('save-edit-task-btn').addEventListener('click', () => {
  const newTitle = document.getElementById('edit-task-title').value.trim();
  if (!newTitle) {
    alert("Task title is required.");
    return;
  }
  currentEditTask.title = newTitle;
  currentEditTask.description = document.getElementById('edit-task-desc').value;
  currentEditTask.dueDate = document.getElementById('edit-task-due').value;
  currentEditTask.priority = document.getElementById('edit-task-priority').value;
  
  projects[currentEditProjectIndex].todos[currentEditTaskIndex] = currentEditTask;
  saveProjects();
  // Actualiza la vista de tareas
  if (currentView.type === 'project' && currentView.index === currentEditProjectIndex) {
    const tasks = projects[currentEditProjectIndex].todos.map((todo, idx) => ({
      ...todo,
      projectIndex: currentEditProjectIndex,
      taskIndex: idx
    }));
    renderTasks(`${projects[currentEditProjectIndex].name} Tasks`, sortTasksByDueDate(tasks));
  } else if (currentView.type === 'special') {
    if (currentView.name === 'upcoming') {
      let tasks = sortTasksByDueDate(getUpcomingTasks());
      renderTasks('Upcoming Tasks', tasks);
    } else if (currentView.name === 'completed') {
      let tasks = sortTasksByDueDate(getCompletedTasks());
      renderTasks('Completed Tasks', tasks);
    }
  }
  document.getElementById('edit-task-modal').style.display = 'none';
});

init();
