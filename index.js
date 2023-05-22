const baseUrl = 'https://rickandmortyapi.com/api';
let characters = `${baseUrl}/character`;
const contenedor = document.querySelector('#contenedor');
const buscar = document.querySelector('#buscar');
const inputBuscar = document.querySelector('#inputBuscar');
const atras = document.querySelector('#atras');
const siguiente = document.querySelector('#siguiente');
const filters = document.querySelectorAll(".btn-check")
let items;

//Funcion para hacer fetch
const fetchData = async (urlApi) => {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error' + error)
    }
}

//Dibuja las cards con el contenido de cada personaje
const dibujarCards = async (urlApi) => {
    try {
        const results = await fetchData(urlApi);
        items = results;
        atras.disabled = false;
        siguiente.disabled = false;
    
        let cardAcumuladas = '';
        results.results.forEach(character => {
            let card = `
            <div class="card shadow p-2 mb-2 rounded-3 col-12 col-md-6 col-lg-4">
                <div class="d-flex">
                    <div class="col-3">
                        <img src="${character.image}" class="img-fluid rounded-3 " alt="">
                    </div>
                    <div class="ms-2 col-9">
                        <div class="fs-3 fw-bold" style="color: #007e80">${character.name}</div>  
                        <div><span class="fw-bold">Genero: </span>${character.gender}</div>
                        <div><span class="fw-bold">Estado: </span>${character.status}</div>
                        <div><span class="fw-bold">Especie: </span>${character.species}</div>
                        <div><span class="fw-bold">Origen: </span>${character.origin.name}</div>
                    </div>
    
                </div>
            </div>
            `;
            
            cardAcumuladas += card;
        });
        contenedor.innerHTML = cardAcumuladas
    } catch (error) {
        let card = `
        <div class="d-flex justify-content-center">
            <div class="card shadow p-2 mb-2 rounded-3 col-12 col-md-6">
                <div class="d-flex">
                    <div class="col-3">
                        <img src="./Assets/images/logoRickandMorty.png" class="img-fluid rounded-3 " alt="">
                    </div>
                    <div class="ms-2 col-9">
                        <div class="fs-1 fw-bold" style="color: #007e80">No se encontraron resultados</div>  
                    </div>
                </div>
            </div>
        </div>

        `;
        contenedor.innerHTML = card
    }
}

//Se encarga del control de los filtros
const addFilterCharacter = (value, origin) => {
  let queryString = "";

  switch (origin) {
    case "status":
      queryString = "status";
      break;
    case "species":
      queryString = "species";
      break;
    case "gender":
      queryString = "gender";
      break;
  }

  if (characters.includes(queryString)) {
    characters = characters.replace(new RegExp(`${queryString}=[^&]+`, "g"), `${queryString}=${value}`);
  } else {
    queryString = `${queryString}=${value}&`;
    characters += characters.includes("?") ? queryString : `?${queryString}`;
  }

  console.log(characters);
  dibujarCards(characters)
};

filters.forEach((item) => {
  item.addEventListener("click", (event) => {
    addFilterCharacter(event.target.labels[0].textContent, event.target.name);
  });
});

//Botones buscar personaje, siguiente y regresar.
const buscarAction = () => {
    characters = `${baseUrl}/character/?name=${inputBuscar.value}`
    dibujarCards(characters);
}
const irSiguiente = () => {
    if(items.info.next){
        characters = items.info.next;
        dibujarCards(characters);
    } else {
        siguiente.disabled = true;
    }
}
const irAtras = () => {
    if(items.info.prev){
        characters = items.info.prev
        dibujarCards(characters);
    } else {
        atras.disabled = true;
    }
}
buscar.addEventListener('click', buscarAction)
siguiente.addEventListener('click', irSiguiente);
atras.addEventListener('click', irAtras);

//Lo primero que se ejecuta
dibujarCards(characters);