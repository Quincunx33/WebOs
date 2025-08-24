// taskmanager.js - টাস্ক ম্যানেজার অ্যাপ
function launchTaskManager() {
  const wrap = document.createElement("div");
  wrap.className = "app-taskmanager";

  wrap.innerHTML = `
        <div class="task-header">
            <h2>✅ Task Manager</h2>
            <button class="add-task-btn">➕ New Task</button>
        </div>
        
        <div class="task-input" style="display:none;">
            <input type="text" class="task-title" placeholder="Task title">
            <textarea class="task-description" placeholder="Description"></textarea>
            <select class="task-priority">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
            </select>
            <input type="date" class="task-due-date">
            <div class="task-actions">
                <button class="save-task-btn">Save</button>
                <button class="cancel-task-btn">Cancel</button>
            </div>
        </div>
        
        <div class="task-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        
        <div class="tasks-container">
            <div class="tasks-list"></div>
        </div>
        
        <div class="task-stats">
            <span class="total-tasks">Total: 0</span>
            <span class="completed-tasks">Completed: 0</span>
            <span class="pending-tasks">Pending: 0</span>
        </div>
    `;

  let tasks = JSON.parse(localStorage.getItem('webos_tasks')) || [];
  let currentFilter = 'all';

  // DOM elements
  const tasksList = wrap.querySelector('.tasks-list');
  const taskInput = wrap.querySelector('.task-input');
  const addTaskBtn = wrap.querySelector('.add-task-btn');
  const saveTaskBtn = wrap.querySelector('.save-task-btn');
  const cancelTaskBtn = wrap.querySelector('.cancel-task-btn');
  const filterBtns = wrap.querySelectorAll('.filter-btn');
  const stats = {
    total: wrap.querySelector('.total-tasks'),
    completed: wrap.querySelector('.completed-tasks'),
    pending: wrap.querySelector('.pending-tasks')
  };

  // Event listeners
  addTaskBtn.addEventListener('click', () => {
    taskInput.style.display = 'block';
    addTaskBtn.style.display = 'none';
  });

  saveTaskBtn.addEventListener('click', addTask);
  cancelTaskBtn.addEventListener('click', cancelAddTask);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  function addTask() {
    const title = wrap.querySelector('.task-title').value.trim();
    const description = wrap.querySelector('.task-description').value.trim();
    const priority = wrap.querySelector('.task-priority').value;
    const dueDate = wrap.querySelector('.task-due-date').value;

    if (!title) return;

    const task = {
      id: Date.now(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    cancelAddTask();
  }

  function cancelAddTask() {
    wrap.querySelector('.task-title').value = '';
    wrap.querySelector('.task-description').value = '';
    wrap.querySelector('.task-priority').value = 'medium';
    wrap.querySelector('.task-due-date').value = '';
    taskInput.style.display = 'none';
    addTaskBtn.style.display = 'block';
  }

  function renderTasks() {
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }

    tasksList.innerHTML = '';
    if (filteredTasks.length === 0) {
      tasksList.innerHTML = '<div class="no-tasks">No tasks found</div>';
      return;
    }

    filteredTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority}`;
      taskElement.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                        ${task.dueDate ? `<span class="due-date">📅 ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                        <span class="priority ${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-task-btn">✏️</button>
                    <button class="delete-task-btn">🗑️</button>
                </div>
            `;
      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      const editBtn = taskElement.querySelector('.edit-task-btn');
      const deleteBtn = taskElement.querySelector('.delete-task-btn');

      checkbox.addEventListener('change', () => toggleTask(task.id));
      editBtn.addEventListener('click', () => editTask(task.id));
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      tasksList.appendChild(taskElement);
    });

    updateStats();
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      wrap.querySelector('.task-title').value = task.title;
      wrap.querySelector('.task-description').value = task.description || '';
      wrap.querySelector('.task-priority').value = task.priority;
      wrap.querySelector('.task-due-date').value = task.dueDate || '';

      taskInput.style.display = 'block';
      addTaskBtn.style.display = 'none';
      // Remove the old task when saving
      saveTaskBtn.onclick = () => {
        task.title = wrap.querySelector('.task-title').value.trim();
        task.description = wrap.querySelector('.task-description').value.trim();
        task.priority = wrap.querySelector('.task-priority').value;
        task.dueDate = wrap.querySelector('.task-due-date').value;

        saveTasks();
        renderTasks();
        cancelAddTask();
        // Reset the save button handler
        saveTaskBtn.onclick = addTask;
      };
    }
  }

  function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem('webos_tasks', JSON.stringify(tasks));
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    stats.total.textContent = `Total: ${total}`;
    stats.completed.textContent = `Completed: ${completed}`;
    stats.pending.textContent = `Pending: ${pending}`;
  }

  // Initial render
  renderTasks();

  createWindow("Task Manager", wrap, "taskmanager");
}
