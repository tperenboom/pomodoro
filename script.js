let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.material-icons');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 0.1 * 60; // 5 minutes in seconds
const toast = document.getElementById('toast');

// Request notification permission when the page loads
if ("Notifications" in window) {
    Notification.requestPermission();
}

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    updateDisplay(timeLeft);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Toast will disappear after 3 seconds
}

function showNotification(message) {
    if ("Notifications" in window && Notifications.permission === "granted") {
        new Notification("Pomodoro Timer", {
            body: message,
            icon: "/favicon.ico" // Optional: add your own favicon path here
        });
    } else {
        // Fallback to toast if notifications are not supported or permitted
        showToast(message);
    }
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    startButton.textContent = 'Pause';
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            switchMode();
            const message = isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!';
            showNotification(message);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    startButton.textContent = 'Start';
    modeText.textContent = 'Work Time';
    
    // Reset toggle button to work mode
    toggleButton.classList.remove('rest-mode');
    toggleButton.classList.add('work-mode');
    toggleButton.querySelector('.material-icons').textContent = 'self_improvement';
    
    updateDisplay(timeLeft);
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    // Update toggle button classes and icon
    if (isWorkTime) {
        toggleButton.classList.remove('rest-mode');
        toggleButton.classList.add('work-mode');
        toggleButton.querySelector('.material-icons').textContent = 'self_improvement';
    } else {
        toggleButton.classList.remove('work-mode');
        toggleButton.classList.add('rest-mode');
        toggleButton.querySelector('.material-icons').textContent = 'work';
    }
    
    updateDisplay(timeLeft);
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});

resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', () => {
    toggleMode();
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
});

// Initialize display
timeLeft = WORK_TIME;
updateDisplay(timeLeft);

// Initialize toggle button state
toggleButton.classList.add('work-mode');
toggleButton.querySelector('.material-icons').textContent = 'self_improvement';

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? 'dark_mode' : 'light_mode';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
});