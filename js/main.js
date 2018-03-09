// Objetos de cada personaje
//Images powered by Gema

const arrayPersonajes = [
    {
        nombre: "Elsa",
        ruta: "img/Elsa.png"
    },
    {
        nombre: "Anna",
        ruta: "img/Anna.png"
    },
    {
        nombre: "Campanilla",
        ruta: "img/Campanilla.png"
    },
    {
        nombre: "Genio",
        ruta: "img/Genio.png"
    },
    {
        nombre: "HadaMadrina",
        ruta: "img/HadaMadrina.png"
    },
    {
        nombre: "Kaa",
        ruta: "img/Kaa.png"
    },
    {
        nombre: "Mushu",
        ruta: "img/Mushu.png"
    },
    {
        nombre: "Pascal",
        ruta: "img/Pascal.png"
    },
    {
        nombre: "Pepito",
        ruta: "img/Pepito.png"
    },
    {
        nombre: "Primavera",
        ruta: "img/Primavera.png"
    },
    {
        nombre: "Rapunzel",
        ruta: "img/Rapunzel.png"
    },
    {
        nombre: "Flynn",
        ruta: "img/Flynn.png"
    }
]

const game = document.getElementById("game");
const rejilla = document.createElement("section");
const winner = document.getElementById("winner");

const song = document.getElementById("song");
const clic = document.getElementById("clic");
const bounce = document.getElementById("bounce");
const win = document.getElementById("win");
const fail = document.getElementById("fail");

const tiempo = 15;
var contador = 0;
var primerSel = "";
var segundoSel = "";
var selPrevio = null;
var eliminados = 0;

var start = document.getElementById("start");
var reloj = document.getElementById("reloj");
var gameover = document.getElementById("game-over");

var segundos = tiempo;

rejilla.setAttribute("class","rejilla");
game.appendChild(rejilla);

function baraja(){
    resetUI();
    song.play();    // La canción comenzará cuando le demos al botón

    //FUNCION PARA CREAR LA REJILLA
    const personajesDoble = arrayPersonajes.concat(arrayPersonajes)
                                .sort(() => 0.5 - Math.random());

    personajesDoble.forEach(personaje => {
        const { nombre, ruta } = personaje;

        const tarjeta = document.createElement("div");  // Para cada personaje crea un div
        tarjeta.classList.add("tarjeta");               // de clase tarjeta,
        tarjeta.dataset.name = nombre;                  // el atributo dataset con cada uno de los personajes
        
        const anverso = document.createElement("div");
        anverso.classList.add("anverso");
        
        const reverso = document.createElement("div");
        reverso.classList.add("reverso");
        reverso.style.backgroundImage = `url(${ruta})`; // y de fondo la imagen

        rejilla.appendChild(tarjeta);
        tarjeta.appendChild(anverso);
        tarjeta.appendChild(reverso);
    });
}

function resetUI(){
    gameover.style.opacity = "0";
    rejilla.classList.remove("out");
    rejilla.classList.add("start");
    winner.classList.remove("open");
    start.style.display = "none";
    reloj.style.display = "initial";
    reloj.style.color = "yellow";
    // resetSel();
    eliminados = 0;
}



//FUNCION DE INICIO DEL JUEGO Y RELOJ CUENTA ATRAS
function startGame(){
    var s = parseInt(segundos % 60);
    var ss = ("0" + s).slice(-2);
    var m = parseInt(segundos / 60);
    var mm = ("0" + m).slice(-2);
    document.getElementById("reloj").innerHTML = mm + ":" + ss;

    console.log(eliminados);
    if (eliminados === 2) {
        return;
    }

    if (segundos<=10){
        reloj.style.color = "red";
    }

    if (segundos > 0) {
        var t = setTimeout( function(){
            startGame();
        },1000);
    } else {
        gameOver();
    }

    segundos--; 
    
}

function restart(){
    rejilla.classList.remove("out");
}

//FUNCION PARA EJECUTAR LA LOGICA DE PARTIDA PERDIDA
function gameOver(){
    segundos = tiempo;
    song.pause();
    song.currentTime = 0;
    fail.currentTime = 0;
    fail.play();
    rejilla.classList.remove("start");
    rejilla.classList.add("out");
   
    setTimeout(function(){
        while(rejilla.firstChild){
            rejilla.removeChild(rejilla.firstChild);
        }
    },1000);

    gameover.style.opacity = "1";
    setTimeout(function(){
        start.style.display = "initial";
        reloj.style.display = "none";
    },2000);
    
}

//EVENTO CLICK TARJETA
rejilla.addEventListener("click",function(evento){
    clic.currentTime = 0;
    clic.play();
    console.log(evento.target);
    var seleccionado = evento.target;

    if (seleccionado.nodeName === "SECTION" ||
     seleccionado.parentNode === selPrevio || 
     seleccionado.parentNode.classList.contains("eliminado")) { // Cuando el elemento seleccionado tenga ese nombre de nodo
        return;                                                     // return te saca del código, impidiendo que se ejecute la línea 79                 
    }
    if (contador < 2) { // Hace que solo puedan seleccionarse dos tarjetas a la vez
        contador++;
        if (contador === 1) {
            primerSel = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado");
        } else {
            segundoSel = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado"); 
        }
            // console.log(primerSel, segundoSel);  

        if (primerSel !=="" && segundoSel !=="") {
            if (primerSel === segundoSel) {
                bounce.currentTime = 0;
                bounce.play();
                setTimeout(eliminar,600);
                setTimeout (resetSel,600);
                contEliminados();
            } else {
                setTimeout (resetSel,600);
                selPrevio = null;
            }
        }
        selPrevio = seleccionado.parentNode;
    }
});

// FUNCION ELIMINAR ELEMENTOS COINCIDENTES
var eliminar = function() {
    var seleccionados = document.querySelectorAll(".seleccionado");    
    seleccionados.forEach(elemento => {
        elemento.classList.add("eliminado");
    });
}

//FUNCION PARA RESETEAR LOS SELECCIONADOS
var resetSel = function() {
    contador = 0;
    primerSel = "";
    segundoSel = "";
    selPrevio = null; // Para que al fallar puedas vovler a pisar el segundo
    
    var seleccionados = document.querySelectorAll(".seleccionado"); // Quita la clase seleccionado a los que la tengan
    seleccionados.forEach(elemento => {
        elemento.classList.remove("seleccionado");
    });
}

//FUNCION PARA CONTAR LOS ELIMINADOS Y CUANDO LLEGUEN A 24 EJECUTAR LA LOGICA DE PARTIDA GANADA
var contEliminados = function () {
    eliminados = document.querySelectorAll(".eliminado").length + 2;
    if (eliminados === 2) {
        winner.classList.add("open");
        win.currentTime = 0;
        win.play();
        segundos = tiempo;
        song.pause();
        song.currentTime = 0;
        rejilla.classList.add("out");
        reloj.style.display = "none";
        start.style.display = "initial";
        setTimeout(function(){
            while(rejilla.firstChild){
                rejilla.removeChild(rejilla.firstChild);
            }
        },1000);

    }
    
}