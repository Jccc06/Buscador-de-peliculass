function maquetarPelis(peliculas){
        for(let peli of peliculas){
            contenedor = document.getElementById("contenedor");
            miDiv = document.createElement("div");       
            miDiv.addEventListener("click", () => 
                LanzaPeticionDetalle(peli.imdbID)
            );
            texto = document.createElement("h2");
            img = document.createElement("img");
            

            img.src = peli.Poster; 
            texto.textContent = peli.Title;

            miDiv.appendChild(img);
            miDiv.appendChild(texto);
            contenedor.appendChild(miDiv);

    }
}

function LanzaPeticionDetalle(id){
    fetch("https://www.omdbapi.com/?i=" + id + "&apikey=5ddaee62").then(response => response.json()).then(data => {
        contenedor = document.getElementById("contenedor");
        miDiv2 = document.createElement("div");
        img = document.createElement("img");
        texto = document.createElement("h2");
        released = document.createElement("h3");
        plot = document.createElement("p");
        boton = document.createElement("button");


        boton.innerHTML = "Cerrar";
        plot.innerHTML = data.Plot;
        released.innerHTML = "Salida: " + data.Released;
        texto.innerHTML = data.Title;
        img.src = data.Poster;
        miDiv2.id = "detalle";


       
        miDiv2.appendChild(img);
        miDiv2.appendChild(texto);
        miDiv2.appendChild(released);
        miDiv2.appendChild(plot);
        miDiv2.appendChild(boton);

        boton.addEventListener("click", () => {
            miDiv2.innerHTML = " ";
            miDiv2.style.visibility = "hidden";
        })

        contenedor.appendChild(miDiv2);

    })
}

function LanzaPeticion(url){
    if(!peticionEnCurso){
        peticionEnCurso = true;
        fetch(url).then(response => response.json()).then(data => {
            maquetarPelis(data.Search);
            //contador++;
            peticionEnCurso = false;
        })
    }
}


window.onload = () => {
    peticionEnCurso = false;
    boton = document.getElementById("botonCargar");
    pelicula = document.getElementById("pelicula");
    buscar = document.getElementById("botonbuscar");
    landing = document.getElementById("botonLanding");
    buscador = document.getElementById("buscador");
    inicio = document .getElementById("landing");
    var contador = 2;

    landing.addEventListener("click",() => {
        buscador.style.visibility = "visible";
        inicio.style.visibility = "hidden";

    })

    buscar.addEventListener("click", ()  => {
        contenedor.innerHTML = " ";
        contador = 2;
         LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value +"&apikey=5ddaee62&page=1");
            boton.style.visibility = "visible";
           
    })

   pelicula.addEventListener("keyup", (e) => {
    peticionEnCurso = false;
        if(pelicula.value.length >= 3){
        contenedor.innerHTML = " ";
        contador = 2;
        LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value +"&apikey=5ddaee62&page=1");
        }
   })


}

var contador = 2;

window.onscroll = () => 
{
   let cercafinal = (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200);
   if(cercafinal){
      LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value +"&apikey=5ddaee62&page="+contador);
      contador++;
   }
}

