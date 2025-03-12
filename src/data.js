export let projects = [];
export let currentProjectIndex = 0;

export function loadProjects() {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    projects = JSON.parse(storedProjects);
  } else {
    projects = [{ name: 'Default', todos: [] }];
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
  if (todo.title.trim() !== '') {
    projects[currentProjectIndex].todos.push(todo);
    saveProjects();
  }
}

export function setCurrentProjectIndex(index) {
  currentProjectIndex = index;
}
