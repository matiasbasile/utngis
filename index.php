<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa con Árbol de Capas</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <link rel="stylesheet" type="text/css" href="assets/css/leaflet.css">
  <script type="text/javascript" src="assets/js/leaflet.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js"></script>
  <link rel="stylesheet" type="text/css" href="assets/css/common.css">
  <link rel="stylesheet" type="text/css" href="assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css" />
</head>
<body>
  
  <div class="row ml0 mr0">
    <div class="col-3 pl0 pr0">
      <div class="leftbar">
        <nav class="navbar _navbar-inverse navbar-fixed-top bg-navbar">
          <img fetchpriority="high" decoding="async" width="200" height="100" src="https://utnchacabuco.ar/wp-content/uploads/2023/10/logo-chacabuco.png" alt="UTN Chacabuco" title="UTN Chacabuco" srcset="https://utnchacabuco.ar/wp-content/uploads/2023/10/logo-chacabuco.png 1413w, https://utnchacabuco.ar/wp-content/uploads/2023/10/logo-chacabuco-1280x777.png 1280w, https://utnchacabuco.ar/wp-content/uploads/2023/10/logo-chacabuco-980x595.png 980w, https://utnchacabuco.ar/wp-content/uploads/2023/10/logo-chacabuco-480x291.png 480w" sizes="(min-width: 0px) and (max-width: 480px) 480px, (min-width: 481px) and (max-width: 980px) 980px, (min-width: 981px) and (max-width: 1280px) 1280px, (min-width: 1281px) 1413px, 100vw" class="wp-image-61">
        </nav>
        <div class="pl5 pr5 pt5">
          <div id="groups"></div>
          <button id="descargar" class="btn btn-block mt20">Descargar geoJSON</button>
        </div>
      </div>
    </div>
    <div class="col-9 pl0 pr0">
      <div class="mapContainer">
        <div id="map"></div>  
      </div>
    </div>
  </div>

<script type="text/javascript" src="assets/js/script.js?v=6"></script>
<script>
const BASE = "<?php echo (isset($_SERVER["BASE"]) ? $_SERVER["BASE"] : "")  ?>";

// Modelo de capas
window.visibleLayers = [];
window.groups = [
  {
    "label":"Accidentes",
    "layers":[
      {
        "type":"point",
        "url":"api/accidentes.php",
        "id":"accidentes",
        "label":"Accidentes",
      }
    ],
  },
  {
    "label":"Servicios",
    "layers":[
      {
        "type":"point",
        "url":"api/semaforos.php",
        "id":"semaforos",
        "label":"Semaforos",
      },
      {
        "type":"point",
        "url":"api/badenes.php",
        "id":"badenes",
        "label":"Badenes",
      }
    ]
  },
];

initMap();
</script>

</body>
</html>
