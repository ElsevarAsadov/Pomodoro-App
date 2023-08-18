const dialogBtn = document.getElementById('dialog-btn')
const duration = document.getElementById('duration')

duration.addEventListener('change', ({target})=>{
    window.api.changeDuration(target.value)
})

dialogBtn.addEventListener('click', ()=>{
   window.api.openFileDialog()
})