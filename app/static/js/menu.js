document.addEventListener("DOMContentLoaded", function(){
    let barras = document.querySelector(".abrir_menu")
    let menu = document.querySelector(".header")
    let background_menu = document.getElementById("background_menu")

    // EVENTOS PARA EL MENU
    barras.addEventListener('click', () => {
        menu.classList.toggle('activate')
        background_menu.classList.toggle('activate')
    })
    background_menu.addEventListener('click', () => {
        menu.classList.toggle('activate')
        background_menu.classList.toggle('activate')
    })
})