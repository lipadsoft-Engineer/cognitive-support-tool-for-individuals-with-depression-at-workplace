// Task management
let tasks = [];

function addTask(title, dueDate) {
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
        return;
    }

    const task = {
        id: Date.now(),
        title,
        status: 'tasks',
        dueDate: parsedDueDate,
        createdAt: new Date()
    };
    tasks.push(task);

    renderTasks();
    prioritizeTasks();
    return task;
}

function moveTask(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const audio = new Audio('./media/done.wav'); 
        audio.play();
        task.status = newStatus;
        renderTasks();
        prioritizeTasks();
    }
}

//display tasks
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
                    ${prevColumn ? `<button onclick="moveTask(${task.id}, '${prevColumn}')">← ${capitalize(prevColumn)}</button>` : '<Button onclick="sliceTask">Slice Task</Button>'}
                    ${nextColumn ? `<button onclick="moveTask(${task.id}, '${nextColumn}')">${capitalize(nextColumn)} →</button>` : '<span>✅</span>'}
                </div>
            `;

            column.appendChild(taskElement);
        });
    });
}

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

// mood tracking
function showMoodPopup() {
    const saveButton = document.getElementById('save-mood-btn');
    const closeButton = document.getElementById('close-popup-btn');
    const moodSelect = document.getElementById('mood-select');

    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 30000);

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        const selectedMood = moodSelect.value;

        showMoodInsight(selectedMood);

        popup.style.display = 'none';
    });
}

const moodInsights = {
    "Happy": "You’re feeling positive and content. Keep doing activities that bring you joy and express gratitude.",
    "Sad": "You may feel low today. Take a break, talk to someone, or engage in something uplifting like music or a walk.",
    "Neutral": "You’re in a balanced state. Try something creative or engaging, or rest to recharge.",
    "Stressed": "You might feel overwhelmed. Take deep breaths, prioritize tasks, and take breaks when needed.",
    "Excited": "You’re full of energy. Channel this excitement into productive tasks or fun activities to keep the momentum going."
};

function showMoodInsight(mood) {
    const notification = document.getElementById('notifications');
    const moodInsight = document.getElementById('notification-list');

    const li = document.createElement('li');
        li.textContent = moodInsights[mood];
        const audio = new Audio('./media/notification1.wav'); 
        audio.play();
        moodInsight.appendChild(li);

    setTimeout(() => {
        moodInsight.removeChild(li);
    }, 15000); 
}

let currentMood = null;

function logMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.mood-btn[data-mood="${mood}"]`).classList.add('active');
}
// Trigger the mood popup every hour
setInterval(showMoodPopup, 3600000);
showMoodPopup();


// Notifications and reminders
let notifiedTasks = [];

function checkNotifications() {
    const notificationList = document.getElementById('notification-list');
    const currentTime = new Date();
    const overdueTasks = tasks.filter(task => 
        task.dueDate < currentTime && task.status !== 'done' && !notifiedTasks.includes(task.id)
    );

    overdueTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `Task "${task.title}" is overdue!`;

        notificationList.appendChild(li);
        
        const audio = new Audio('./media/notification.wav'); 
        audio.play();

        notifiedTasks.push(task.id);
    });
}

let workTime = 0; 
let timerDisplay = document.getElementById('time-display');
let breakPopup = document.getElementById('break-popup');

function startWorkTimer() {
    setInterval(() => {
        workTime++;

        updateTimerDisplay();

        if (workTime % 60 === 0) { // Every hour
            showBreakPopup();
        }
    }, 60000); 
}

// Update the timer display
function updateTimerDisplay() {
    let minutes = Math.floor(workTime / 60);
    let seconds = workTime % 60;
    
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`; 
}

function showBreakPopup() {
    breakPopup.style.display = 'block';
    
    setTimeout(() => {
        breakPopup.style.display = 'none'; 
    }, 5000);
}

window.onload = () => {
    const closePopupBtn = document.getElementById('close-popup-btn');
    
    if (!closePopupBtn) {
        console.log('Close button not found');
        return;
    }

   

    closePopupBtn.addEventListener('click', () => {
        console.log('close btn clicked');
        breakPopup.style.display = 'none';  
    });

    startWorkTimer();
};

// Event Listeners
document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('new-task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const taskValue = taskInput.value.trim();
    const dueDateValue = dueDateInput.value.trim();

    if (taskValue && dueDateValue) {
        addTask(taskValue, dueDateValue);
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();
    } else {
        
        alert('Please enter both a task and a valid due date.');
        const audio = new Audio('./media/notification.wav'); 
        audio.play();
    }
});


document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        logMood(e.target.dataset.mood);
    });
});

// Initial render and periodic updates
renderTasks();
setInterval(checkNotifications, 10000);