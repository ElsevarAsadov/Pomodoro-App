const settingsBtn = document.getElementById('settings-btn');
const timerContainer = document.querySelector('.timer')
const totalPomodoroSet = document.querySelector('.total-pomodoro')
const alarmSound = document.getElementById('alarm')

let intervalID;
let time = 0 //secs
let totalSet = 1

//listens main process and whenever audio file is changed then is changes audio src
window.api.getFilePath((event, value)=>{
    alarmSound.src = value
})

function convertMin2Sec(x){
    return Math.floor(x * 60);
}

//default endTime is 20minutes
let endTime = convertMin2Sec(20)

//listens main process and whenever endTime duration changes then it will change endTime in renderer
window.api.changeDuration((event, value)=>{
    endTime = convertMin2Sec(value)
})

function updateTime() {

    const minute = `${Math.floor(time / 60)}`
    const second = `${time % 60}`

    timerContainer.innerHTML = `${minute.padStart(2, '0')}:${second.padStart(2, '0')}`
}


function clearTimerContainer(){
    timerContainer.innerHTML = '00:00'
}

function setTotalPomodoroSet(){
    totalPomodoroSet.innerHTML = String(totalSet)
}

function playAlarmSound(){
    alarmSound.currentTime = 0
    alarmSound.play()
}
function stopAlarmSound(){
    alarmSound.pause()
    alarmSound.currentTime = 0
}

function checkEnd(){
    if (time >= endTime){
        stopTimer()
        setStopState()
        playAlarmSound()

        //stop for 5secs
        setTimeout(()=>{
            updateTime()
            setTotalPomodoroSet()
        }, alarmSound.duration * 1000) //ms
        totalSet++
        return true
    }
    return false
}

function startTimer() {
    intervalID = setInterval(() =>{
        updateTime()
        if (!checkEnd()) time++}, 1000)
}

function pauseTimer() {
    clearInterval(intervalID)
}

function stopTimer() {
    clearInterval(intervalID)
    time = 0
}


const playBtn = document.getElementById('play-btn')
const pauseBtn = document.getElementById('pause-btn')
const stopBtn = document.getElementById('stop-btn')

function setPlayState() {
    if (!alarmSound.paused){
        console.log("STOP")
        stopAlarmSound()
    }
    playBtn.style.display = 'none'
    pauseBtn.style.display = 'flex'
    stopBtn.style.display = 'flex'
}

function setPauseState() {
    pauseBtn.style.display = 'none'
    playBtn.style.display = 'flex'
}

function setStopState() {
    playBtn.style.display = 'flex'
    pauseBtn.style.display = 'none'
    stopBtn.style.display = 'none'
}


playBtn.addEventListener('click', () => {
    startTimer()
    setPlayState()
})

pauseBtn.addEventListener('click', () => {
    pauseTimer()
    setPauseState()

})

stopBtn.addEventListener('click', () => {
    stopTimer()
    setStopState()
    clearTimerContainer()
})


settingsBtn.addEventListener('click', () => {
    window.api.openSettingsMenu()
})


document.addEventListener('DOMContentLoaded', () => {
    setTotalPomodoroSet()
})