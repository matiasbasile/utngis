function initMap() {
  // Inicializar el mapa
  window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // Puedes cambiar el estilo del mapa según tus preferencias
    center: [-60.471581,-34.642337], // Coordenadas de centro del mapa (longitud, latitud)
    zoom: 13 // Nivel de zoom inicial
  });

  map.on("load",function() {
    initMenu();
  });
}

function initMenu() {
  $("#groups").empty();
  var s = "";
  for(let i = 0; i < window.groups.length; i++) {
    let grupo = window.groups[i];
    s += renderGroup(grupo);
  }
  $("#groups").html(s);
}

function renderGroup(group) {
  var s = `<div class="form-group"><b class='mb10 db'>${group.label}:</b><ul class="list-group">`;
  for(let i = 0; i < group.layers.length; i++) {
    let layer = group.layers[i];
    s += renderMenuItem(layer);
  }
  s += "</ul></div>";
  return s;
}

function toggleStyleMap(tipo) {
  $(".btn-toggle-type").removeClass("active");
  if (tipo == "calle") {
    map.setStyle('mapbox://styles/mapbox/streets-v11');
  } else {
    map.setStyle('mapbox://styles/mapbox/satellite-v9');
  }
  $("#btn-"+tipo).addClass("active");
  initLayers();
}

function getLayer(id) {
  for(let j = 0; j < window.groups.length; j++) {
    let group = window.groups[j];    
    for(let i = 0; i < group.layers.length; i++) {
      let layer = group.layers[i];
      if (layer.id == id) {
        return layer;
      }
    }
  }
  return null;
}

function renderMenuItem(layer) {
  return `
    <li id="menuItem_${layer.id}" data-id="${layer.id}" onclick="loadLayer('${layer.id}')" class="list-group-item">
      ${layer.label}
    </li>
  `;
}

function loadLayer(layerId) {
  if ($("#menuItem_"+layerId).hasClass("active")) {
    $("#menuItem_"+layerId).removeClass("active")
  } else {
    $("#menuItem_"+layerId).addClass("active")
    var layer = getLayer(layerId);
    if (layer.type == "shape") {
      loadGeoJSON(layer);
    }
  }
}

// Función para cargar un GeoJSON y agregarlo como una fuente de datos y capa
function loadGeoJSON(layer) {
  fetch(layer.url)
    .then(response => response.json())
    .then(data => {
      map.addSource(layer.id, {
        type: 'geojson',
        data: data
      });
      map.addLayer({
        'id': layer.id,
        'type': 'fill',
        'source': layer.id,
        'layout': {},
        'paint': {
          'fill-color': ['get', 'color'],
          'fill-opacity': layer.opacity
        }
      });

      // Agregar el tooltip al mapa
      map.on('click', layer.id, function (e) {
        var coordinates = e.lngLat;
        var properties = e.features[0].properties; // Propiedades del elemento del GeoJSON
        if (typeof properties.nombre != "undefined") {
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('<h3>' + properties.nombre + '</h3>')
            .addTo(map);
        }
      });

    })
    .catch(error => console.error('Error al cargar el GeoJSON:', error));
}
