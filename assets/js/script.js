function initMap() {
  var center = [-34.642337,-60.471581];
  window.mapa = L.map($("#map")[0]).setView(center, 15);


  var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+MAPBOX_KEY, {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/satellite-streets-v11',
    accessToken: MAPBOX_KEY,
  }).addTo(window.mapa);

  var streetLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+MAPBOX_KEY, {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: MAPBOX_KEY,
  });

  var baseMaps = {
    "Satélite": satelliteLayer,
    "Calles": streetLayer,
  }
  L.control.layers(baseMaps).addTo(window.mapa);

  window.markers = L.markerClusterGroup({
    maxClusterRadius: 80, // Establecer la distancia máxima en píxeles para agrupar los marcadores
  });

  window.mapa.addLayer(window.markers);

  initMenu();
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
    <li id="menuItem_${layer.id}" data-id="${layer.id}" onclick="viewLayer('${layer.id}')" class="list-group-item">
      ${layer.label}
    </li>
  `;
}

function viewLayer(layerId) {
  if ($("#menuItem_"+layerId).hasClass("active")) {
    // OCULTAMOS LA CAPA
    $("#menuItem_"+layerId).removeClass("active");

    for(let i = 0; i < window.visibleLayers.length; i++) {
      let vl = window.visibleLayers[i];
      if (vl.id == layerId) {
        vl.layer.remove();
        window.visibleLayers.splice(i,1);
        break;
      }
    }
  } else {
    // CARGAMOS LA CAPA
    $("#menuItem_"+layerId).addClass("active")
    var layer = getLayer(layerId);
    if (layer.type == "shape") {
      loadShape(layer);
    } else if (layer.type == "point") {
      loadPoint(layer);
    }
  }
}

function loadPoint(layer) {
  $.ajax({
    "url":layer.url,
    "dataType":"json",
    "success":function(resultado) {
      for (let i = 0; i < resultado.length; i++) {
        let punto = resultado[i];
        renderPoint(punto);
      }
    }
  })
}

function renderPoint(punto) {
  var icono = L.icon({
    iconUrl: 'assets/images/map-icon.svg',
    iconSize: [32, 45], // size of the icon
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
  });
  var marker = L.marker([punto.latitud, punto.longitud], {
    icon: icono
  });
  var tooltip = `
  <b>Fecha: </b> ${punto.fecha}<br/>
  <b>Tipo: </b>${punto.tipo}<br/>
  <a target="_blank" href="${punto.url}">Ver link</a>`;
  marker.bindPopup(tooltip);
  markers.addLayer(marker);
}

// Ej: workspace.loadShape({"path":"uploads/1/2023-04-08/calculation_1/vectorized"})
function loadShape(layer) {
  // Crear un nuevo worker y cargar la capa Shape
  var worker = new Worker('/assets/js/shapeLoader.js?v='+Math.round(Math.random()*100));
  worker.addEventListener('message', function(e) {
    var geojson = e.data;

    // Crear una capa GeoJSON y añadirla al mapa
    var l = L.geoJSON(geojson,{
      // Para que pinte con los colores correspondientes cada vector
      style: function (feature) {
        return {
          "fillColor": (layer.color ?? feature.properties.color),
          "weight": (layer.weight ?? 1),
          "opacity": (layer.opacity ?? 1),
          "color": (layer.color ?? feature.properties.color),
          "fillOpacity": (layer.opacity ?? 1)
        };
      },
      pointToLayer: function (feature, latlng) {
        var defaultMarkerOptions = {
          radius: 5, // Radio del círculo
          color: 'red', // Color del círculo
          fillColor: 'red', // Color de relleno del círculo
          fillOpacity: 1 // Opacidad del relleno del círculo
        };
        return L.circleMarker(latlng, defaultMarkerOptions);
      },
      onEachFeature: function (feature, layer) {
        if (typeof feature.properties.nombre != undefined) {
          layer.bindTooltip(feature.properties.nombre).openTooltip();
        }
      }
    }).addTo(window.mapa);
    window.visibleLayers.push({
      "id":layer.id,
      "layer":l
    });
  });
  // Iniciar la carga del archivo Shape
  let url = BASE + "/" + layer.url;
  worker.postMessage(url);
}