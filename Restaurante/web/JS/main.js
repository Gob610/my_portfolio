let btnAbrirPopup = document.getElementById("btn-abrir-popup"),
    overlay = document.getElementById("overlay"),
    popup = document.getElementById("popup"),
    btnCerrarPopup = document.getElementById("btn-cerrar-popup"),
    //REGISTRARSE
    btnAbrirPopup1 = document.getElementById("btn-abrir-popup1"),
    overlay1 = document.getElementById("overlay1"),
    popup1 = document.getElementById("popup1"),
    btnCerrarPopup1 = document.getElementById("btn-cerrar-popup1");

btnAbrirPopup.addEventListener("click",function(){
    overlay.classList.add("active");
    popup.classList.add("active");
});

btnCerrarPopup.addEventListener("click",function(){
    overlay.classList.remove("active");
    popup.classList.remove("active");
});

//REGISTRARSE

btnAbrirPopup1.addEventListener("click",function(){
    overlay1.classList.add("active");
    popup1.classList.add("active");
});
btnCerrarPopup1.addEventListener("click",function(){
    overlay1.classList.remove("active");
    popup1.classList.remove("active");
});


const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".header-nav");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("header-nav_visible");
})
