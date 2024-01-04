(function(){
    let burger = document.getElementById("burger"),
        menu1 = document.getElementById("desplegar1");
    burger.addEventListener("click",function(){
        menu1.classList.toggle("active");
    });
})()