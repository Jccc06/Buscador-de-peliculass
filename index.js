pelisFav = [];
miStorage = window.localStorage;
entrado = false;

function maquetarPelis(peliculas){
        for(let peli of peliculas){
            contenedor = document.getElementById("contenedor");
            miDiv = document.createElement("div");       
            miDiv.addEventListener("click", () => 
                LanzaPeticionDetalle(peli.imdbID)
            );
            texto = document.createElement("h2");
            img = document.createElement("img");
            img.onerror = (e) => e.target.src = "/img/errorimagen.png";

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
        img2 = document.createElement("img"); 

      
        img2.src = "./img/corazon.png";
        boton.innerHTML = "Cerrar";
        plot.innerHTML = data.Plot;
        released.innerHTML = "Salida: " + data.Released;
        texto.innerHTML = data.Title;
        img.src = data.Poster;
        miDiv2.id = "detalle";

        img2.addEventListener("click",() => {
            if(pelisFav.includes(data.imdbID)){
                img2.src = "./img/corazon.png";
                pelisFav.splice(pelisFav.indexOf(data.imdbID),1);
                miStorage.setItem("PelisFavoritas", JSON.stringify(pelisFav));
            }
            else{
                img2.src = "./img/corazonrojo.png";
                pelisFav.push(data.imdbID);
                miStorage.setItem("PelisFavoritas", JSON.stringify(pelisFav));
                entrado = true;
            }   
        });
        
       
        if(entrado){ 
            if(pelisFav.includes(data.imdbID))
                img2.src = "./img/corazonrojo.png";
            else{
                img2.src = "./img/corazon.png";
            }
        }
        
       
        miDiv2.appendChild(img);
        miDiv2.appendChild(texto);
        miDiv2.appendChild(released);
        miDiv2.appendChild(plot);
        miDiv2.appendChild(boton);
        miDiv2.appendChild(img2);

        boton.addEventListener("click", () => {
            miDiv2.innerHTML = " ";
            miDiv2.style.visibility = "hidden";
        })


        contenedor.appendChild(miDiv2);

         

    })
}

function maquetarFavoritos(id){
    for(peli of id){
    fetch("https://www.omdbapi.com/?i=" + peli + "&apikey=5ddaee62").then(response => response.json()).then(data => {
            maquetarPelis([data]); 
            peticionEnCurso = false;
        })
    }
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
    if(!miStorage.getItem("PelisFavoritas")){
        miStorage.setItem("PelisFavoritas", JSON.stringify([]));
        pelisFav = [];
    }
    else
        pelisFav = JSON.parse(miStorage.getItem("PelisFavoritas"));

    peticionEnCurso = false;
    pelicula = document.getElementById("pelicula");
    buscar = document.getElementById("botonbuscar");
    landing = document.getElementById("botonLanding");
    buscador = document.getElementById("buscador");
    inicio = document.getElementById("landing");
    año = document.getElementById("Año");
    tipo = document.getElementById("tipo");
    var contador = 2;
    favoritos = document.getElementById("favoritos");

    landing.addEventListener("click",() => {
        buscador.style.visibility = "visible";
        inicio.style.visibility = "hidden";

    })

    buscar.addEventListener("click", ()  => {
        contenedor.innerHTML = " ";
        contador = 2;

        if(tipo.value=="cualquiera"){
            tipoBusqueda = "";
        }else if(tipo.value == "movie"){
            tipoBusqueda = "&type=movie";
        }else if(tipo.value == "series"){
            tipoBusqueda = "&type=series";
        }

        if(!año.value){
         LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value + tipoBusqueda + "&apikey=5ddaee62&page=1");
        }
        else{
         LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value + tipoBusqueda + "&y=" + año.value +"&apikey=5ddaee62&page=1");   
        }
           
    })

   pelicula.addEventListener("keyup", (e) => {
    peticionEnCurso = false;
        if(pelicula.value.length >= 3){
        contenedor.innerHTML = " ";
        contador = 2;

        if(tipo.value=="cualquiera"){
            tipoBusqueda = "";
        }else if(tipo.value == "movie"){
            tipoBusqueda = "&type=movie";
        }else if(tipo.value == "series"){
            tipoBusqueda = "&type=series";
        }

        if(!año.value){
         LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value + tipoBusqueda + "&apikey=5ddaee62&page=1");
        }
        else{
         LanzaPeticion("https://www.omdbapi.com/?s=" + pelicula.value + tipoBusqueda + "&y=" + año.value +"&apikey=5ddaee62&page=1");   
        }

        }
   })


   favoritos.addEventListener("click", () => {
        contenedor.innerHTML = " ";
        maquetarFavoritos(pelisFav);
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