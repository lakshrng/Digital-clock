document.addEventListener("DOMContentLoaded", () => {
    setInterval(updateClock, 1000);
    updateClock();

    document.getElementById("set-alarm-btn").addEventListener("click", setAlarm);
    document.getElementById("theme-select").addEventListener("change", changeTheme);
    document.getElementById("start-countdown").addEventListener("click", startCountdown);
    document.getElementById("start-stopwatch").addEventListener("click", startStopwatch);
    document.getElementById("stop-stopwatch").addEventListener("click", stopStopwatch);
    document.getElementById("reset-stopwatch").addEventListener("click", resetStopwatch);
});

let alarms = [];
let countdownInterval;
let stopwatchInterval;
let stopwatchTime = 0;
let running = false;

function updateClock() {
    const now = new Date();
    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const displayHours = hours.toString().padStart(2, '0');

    clock.innerHTML = `${displayHours}:${minutes}:${seconds} ${ampm}`;
    date.textContent = now.toLocaleDateString();

    checkAlarm(displayHours, minutes, ampm);
}

function setAlarm() {
    const alarmInput = document.getElementById("alarm-input");
    if (!alarmInput.value) {
        alert("Please select a valid alarm time.");
        return;
    }

    let [hours, minutes] = alarmInput.value.split(":");
    let ampm = "AM";

    hours = parseInt(hours, 10);
    if (hours >= 12) {
        ampm = "PM";
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    const alarmTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    if (!alarms.includes(alarmTime)) {
        alarms.push(alarmTime);
        updateAlarmList();
    } else {
        alert("Alarm already set for this time.");
    }

    alarmInput.value = "";
}

function updateAlarmList() {
    const alarmListElement = document.getElementById("alarm-list");
    alarmListElement.innerHTML = alarms.map((alarm, index) => `
        <div class="alarm-item">
            ${alarm} <button onclick="removeAlarm(${index})">Remove</button>
        </div>
    `).join("");
}

function removeAlarm(index) {
    alarms.splice(index, 1);
    updateAlarmList();
}

function checkAlarm(hours, minutes, ampm) {
    const currentTime = `${hours}:${minutes} ${ampm}`;
    if (alarms.includes(currentTime)) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    let alarmRinging = true;
    alert("⏰ Alarm is ringing!");
    document.body.classList.add("alarm-alert");

    setTimeout(() => {
        if (alarmRinging) {
            document.body.classList.remove("alarm-alert");
        }
    }, 5000);
}

function startCountdown() {
    const minutes = parseInt(document.getElementById("countdown-minutes").value) || 0;
    const seconds = parseInt(document.getElementById("countdown-seconds").value) || 0;
    const totalSeconds = minutes * 60 + seconds;
    const display = document.getElementById("countdown-display");
    const progressBar = document.getElementById("countdown-progress");

    if (totalSeconds <= 0) {
        alert("Enter a valid countdown time.");
        return;
    }

    clearInterval(countdownInterval); 
    let remainingTime = totalSeconds;

    countdownInterval = setInterval(() => {
        const mins = Math.floor(remainingTime / 60);
        const secs = remainingTime % 60;

        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (progressBar) {
            progressBar.style.width = `${(remainingTime / totalSeconds) * 100}%`;
            progressBar.style.backgroundColor = "var(--accent-color)";
            progressBar.style.transition = "width 1s linear";
        }

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            display.textContent = "⏳ Time's Up!";
            if (progressBar) progressBar.style.width = "0%";
            alert("⏳ Countdown Complete!");
        }

        remainingTime--;
    }, 1000);
}

function startStopwatch() {
    if (!running) {
        running = true;
        const startTime = Date.now() - stopwatchTime;
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
    }
}

function stopStopwatch() {
    running = false;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    running = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const display = document.getElementById("stopwatch-display");
    const milliseconds = (stopwatchTime % 1000).toString().padStart(3, '0');
    const seconds = Math.floor((stopwatchTime / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((stopwatchTime / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hours = Math.floor(stopwatchTime / (1000 * 60 * 60)).toString().padStart(2, '0');
    display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function changeTheme() {
    document.body.className = document.getElementById("theme-select").value;
}
