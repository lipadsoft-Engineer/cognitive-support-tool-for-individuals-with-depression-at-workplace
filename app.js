// Task management
let tasks = [];

function addTask(title, dueDate) {
    const task = {
        id: Date.now(),
        title,
        status: 'tasks',
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
    const columns = ['tasks', 'todo', 'in-progress', 'done'];

    columns.forEach((status, index) => {
        const column = document.querySelector(`#${status} .task-list`);
        column.innerHTML = '';

        tasks.filter(task => task.status === status).forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';

            const prevColumn = index > 0 ? columns[index - 1] : null;
            const nextColumn = index < columns.length - 1 ? columns[index + 1] : null;

            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>Due: ${task.dueDate.toLocaleDateString()}</p>
                <div class="task-actions">
                    ${prevColumn ? `<button onclick="moveTask(${task.id}, '${prevColumn}')">← ${capitalize(prevColumn)}</button>` : ''}
                    ${nextColumn ? `<button onclick="moveTask(${task.id}, '${nextColumn}')">${capitalize(nextColumn)} →</button>` : '<span>✅</span>'}
                </div>
            `;

            column.appendChild(taskElement);
        });
    });
}

// Helper function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
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