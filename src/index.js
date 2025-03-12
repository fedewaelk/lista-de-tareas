let projects = [];
let currentProjectIndex = null;

// Cargar
function loadProjects() {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    projects = JSON.parse(storedProjects);
  } else {
    projects = [{ name: 'Default', todos: [] }];
  }
  currentProjectIndex = 0;
}

// Guardar
function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

//RENDER INTERFAZ
// Render lista de proyectos
function renderProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        currentProjectIndex = index;
        renderCurrentProject();
      });
      projectsList.appendChild(li);
    });
  }
  
  // Render tareas del proyecto seleccionado
  function renderCurrentProject() {
    const currentProject = projects[currentProjectIndex];
    document.getElementById('current-project-title').textContent = `Tasks in ${currentProject.name}`;
    
    const todosList = document.getElementById('todos-list');
    todosList.innerHTML = '';
    currentProject.todos.forEach((todo, idx) => {
      const li = document.createElement('li');
      li.textContent = todo.title;
      todosList.appendChild(li);
    });
  }
  

  //ADD PROJ TASK
  // Agregar un nuevo proyecto
function addProject() {
    const projectInput = document.getElementById('new-project-input');
    const projectName = projectInput.value.trim();
    if (projectName !== '') {
      projects.push({ name: projectName, todos: [] });
      projectInput.value = '';
      saveProjects();
      renderProjects();
    }
  }
  
  // Agregar una nueva tarea al proyecto actual
  function addTodo() {
    const todoInput = document.getElementById('new-todo-input');
    const todoTitle = todoInput.value.trim();
    if (todoTitle !== '' && currentProjectIndex !== null) {
      projects[currentProjectIndex].todos.push({ title: todoTitle });
      todoInput.value = '';
      saveProjects();
      renderCurrentProject();
    }
  }
  
  document.getElementById('add-project-btn').addEventListener('click', addProject);
  document.getElementById('add-todo-btn').addEventListener('click', addTodo);

  
  // INI APP
function init() {
    loadProjects();
    renderProjects();
    renderCurrentProject();
  }
  
  init();
  