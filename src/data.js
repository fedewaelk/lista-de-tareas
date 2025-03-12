export let projects = [];
export let currentProjectIndex = 0;

export function loadProjects() {
  const stored = localStorage.getItem('projects');
  if (stored) {
    projects = JSON.parse(stored);
  } else {
    projects = [];
  }
  currentProjectIndex = 0;
}

export function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

export function addProject(projectName) {
  if (projectName.trim() !== '') {
    projects.push({ name: projectName, todos: [] });
    saveProjects();
  }
}

export function addTodo(todo) {
  todo.completed = false;
  projects[currentProjectIndex].todos.push(todo);
  saveProjects();
}

export function updateTodoCompletion(projectIndex, todoIndex, completed) {
  projects[projectIndex].todos[todoIndex].completed = completed;
  saveProjects();
}

export function setCurrentProjectIndex(index) {
  currentProjectIndex = index;
}

export function getUpcomingTasks() {
  const upcoming = [];
  projects.forEach((project, pIndex) => {
    project.todos.forEach((todo, tIndex) => {
      if (!todo.completed) {
        upcoming.push({ ...todo, projectIndex: pIndex, taskIndex: tIndex });
      }
    });
  });
  return upcoming;
}

export function getCompletedTasks() {
  const completedList = [];
  projects.forEach((project, pIndex) => {
    project.todos.forEach((todo, tIndex) => {
      if (todo.completed) {
        completedList.push({ ...todo, projectIndex: pIndex, taskIndex: tIndex });
      }
    });
  });
  return completedList;
}
