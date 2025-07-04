document.addEventListener("DOMContentLoaded", function(){
    let barras = document.querySelector(".abrir_menu")
    let menu = document.querySelector(".header")
    let backgraund_menu = document.getElementById("backgraund_menu")

    // EVENTOS PARA EL MENU
    barras.addEventListener('click', () => {
        menu.classList.toggle('activate')
        backgraund_menu.classList.toggle('activate')
    })
    backgraund_menu.addEventListener('click', () => {
        menu.classList.toggle('activate')
        backgraund_menu.classList.toggle('activate')
    })
})