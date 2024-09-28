function initMap() {
  var center = [-34.642337,-60.471581];
  window.mapa = L.map($("#map")[0]).setView(center, 15);

  var streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
  }).addTo(window.mapa);

  var baseMaps = {
    "Calles": streetLayer,
  }
  L.control.layers(baseMaps).addTo(window.mapa);

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
    
    // Controlamos que ya no este visible
    for(let i = 0; i < window.visibleLayers.length; i++) {
      let ll = window.visibleLayers[i];
      if (ll == layerId) {
        return;
      }
    }
    window.visibleLayers.push(layerId);

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
      var capa = L.layerGroup();
      if (layer.id == "accidentes") {
        // Si son accidentes, se tienen que agrupar
        capa = L.markerClusterGroup({
          maxClusterRadius: 80, // Establecer la distancia máxima en píxeles para agrupar los marcadores
        });
      }
      window.mapa.addLayer(capa);
      for (let i = 0; i < resultado.length; i++) {
        let punto = resultado[i];
        renderPoint(punto, capa);
      }
    }
  })
}

function addLayer(layer) {
  
}

function renderPoint(punto, layer) {

  var icono = L.icon({
    iconUrl: 'assets/images/map-icon.svg',
    iconSize: [32, 45],
    iconAnchor: [16, 16],
  });

  if (punto.tipo_marcador == "semaforo") {
    var icono = L.icon({
      iconUrl: 'assets/images/semaforo.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  } else if (punto.tipo_marcador == "baden") {
    var icono = L.icon({
      iconUrl: 'assets/images/burro.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }
  
  var marker = L.marker([punto.latitud, punto.longitud], {
    icon: icono
  });

  if (punto.tipo_marcador == "accidente") {
    var tooltip = `
    <b>Fecha: </b> ${punto.fecha}<br/>
    <b>Tipo: </b>${punto.tipo}<br/>
    <a target="_blank" href="${punto.url}">Ver link</a>`;
    marker.bindPopup(tooltip);
  }

  layer.addLayer(marker);
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

function generateGeoJSON(markers) {
  var geojson = {
    "type": "FeatureCollection",
    "features": markers.map(function(marker) {
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [marker.getLatLng().lng, marker.getLatLng().lat]
        },
        "properties": {
          "popupContent": marker.getPopup().getContent()
        }
      };
    })
  };
  return geojson;
}

function downloadGeoJSON() {
  var geojsonData = generateGeoJSON();
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojsonData));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "markers.geojson");
  document.body.appendChild(downloadAnchorNode); // requerido para Firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}