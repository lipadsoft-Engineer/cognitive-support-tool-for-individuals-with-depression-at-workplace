// Task management
let tasks = [];

function addTask(title) {
    const task = {
        id: Date.now(),
        title,
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 1 week
        createdAt: new Date()
    };
    tasks.push(task);
    renderTasks();
    prioritizeTasks();
}

function moveTask(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        renderTasks();
        prioritizeTasks();
    }
}

function renderTasks() {
    const columns = ['todo', 'in-progress', 'done'];
    columns.forEach(status => {
        const column = document.querySelector(`#${status} .task-list`);
        column.innerHTML = '';
        tasks.filter(t => t.status === status).forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>Due: ${task.dueDate.toLocaleDateString()}</p>
                <div class="task-actions">
                    ${status !== 'todo' ? `<button onclick="moveTask(${task.id}, 'todo')">← To-Do</button>` : ''}
                    ${status !== 'in-progress' ? `<button onclick="moveTask(${task.id}, 'in-progress')">In Progress</button>` : ''}
                    ${status !== 'done' ? `<button onclick="moveTask(${task.id}, 'done')">Done →</button>` : ''}
                </div>
            `;
            column.appendChild(taskElement);
        });
    });
}

// AI-driven task prioritization
function prioritizeTasks() {
    tasks.sort((a, b) => {
        const scoreA = calculateTaskScore(a);
        const scoreB = calculateTaskScore(b);
        return scoreB - scoreA;
    });
    renderTasks();
}

function calculateTaskScore(task) {
    let score = 0;
    const daysUntilDue = (task.dueDate - new Date()) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDue < 0) score += 100; // Overdue tasks get highest priority
    else if (daysUntilDue < 1) score += 75;
    else if (daysUntilDue < 3) score += 50;
    else if (daysUntilDue < 7) score += 25;

    if (task.status === 'in-progress') score += 10;

    return score;
}

// Reminders & Notifications
function checkNotifications() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';
    
    const currentTime = new Date();
    const overdueTasks = tasks.filter(task => 
        task.dueDate < currentTime && task.status !== 'done'
    );

    overdueTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `Task "${task.title}" is overdue!`;
        notificationList.appendChild(li);
    });
}

// Mood Tracking
let currentMood = null;

function logMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.mood-btn[data-mood="${mood}"]`).classList.add('active');
    // Here you could also save the mood to local storage or send it to a server
}

// Event Listeners
document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('new-task-input');
    if (input.value.trim()) {
        addTask(input.value.trim());
        input.value = '';
    }
});

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        logMood(e.target.dataset.mood);
    });
});

// Initial render and periodic updates
renderTasks();
setInterval(checkNotifications, 60000); // Check for notifications every minute