// Importa la librería shp.js en el worker
importScripts('/assets/js/shp.js');

// Agrega un evento para escuchar los mensajes del hilo principal
self.addEventListener('message', function(e) {
  var shapeFilePath = e.data;

  // Carga el archivo Shape utilizando shp.js
  shp(shapeFilePath+"?d="+Math.round(Math.random()*100)).then(function(geojson) {
    // Envía el resultado de vuelta al hilo principal
    self.postMessage(geojson);
  });
});