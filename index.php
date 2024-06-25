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
  <link rel="stylesheet" type="text/css" href="assets/css/common.css">
  <link rel="stylesheet" type="text/css" href="assets/css/style.css">
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
        </div>
      </div>
    </div>
    <div class="col-9 pl0 pr0">
      <div class="mapContainer">
        <div id="map"></div>  
      </div>
    </div>
  </div>

<script type="text/javascript" src="assets/js/script.js"></script>
<script>
const BASE = "<?php echo (isset($_SERVER["BASE"]) ? $_SERVER["BASE"] : "")  ?>";
const MAPBOX_KEY = "<?php echo (isset($_SERVER["MAPBOX_KEY"]) ? $_SERVER["MAPBOX_KEY"] : "")  ?>";

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
        "type":"shape",
        "url":"data/calles/calles",
        "id":"calles",
        "label":"Asfalto",
        "color": "#ff0000",
        "weight": 3,
        "opacity": 1,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Red agua corriente",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-cloacas",
        "label":"Cloacas",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/pozos_agua/pozos_agua",
        "id":"pozos-de-agua",
        "label":"Pozos de agua",
        "color": "#ff0000",
        "weight": 3,
        "opacity": 1,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Semáforos",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Cámaras de Vigilancia",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/estacionamiento_zonas/estacionamiento_zonas",
        "id":"estacionamiento-zonas",
        "label":"Zonas de Estacionamiento",
        "opacity":0.8,
        "color": "#ff0000",
        "weight": 3,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Puntos de Estacionamiento",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Bicisendas",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Cobertura de Gas Natural",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Conductos Pluviales",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"pozos-de-agua",
        "label":"Cordón Cuneta",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Reductores de velocidad",
        "opacity":0.5,
      }, 
    ]
  },
  {
    "label":"Geografía y Ambiente",
    "layers":[
      {
        "type":"shape",
        "url":"data/barrios/barrios",
        "id":"barrios",
        "label":"Barrios",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/sectores",
        "id":"sectores",
        "label":"Sectores",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Catastro Chacra",
        "opacity":0.5,
      },  
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Catastro Manzana",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Catastro Quinta",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Edificios en altura",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Espacios Verdes",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Luminarias LED",
        "opacity":0.5,
      },
    ], 
  },
    {
    "label":"Puntos de Interés",
    "layers":[
      {
        "type":"shape",
        "url":"data/barrios/",
        "id":"barrios",
        "label":"Barrios",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Escuelas Secundarias",
        "opacity":0.5,
      },   
    ], 
  },
  {
    "label":"Instituciones",
    "layers":[
      {
        "type":"shape",
        "url":"data/calles",
        "id":"calles",
        "label":"Agencias Gubernamentales",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/calles",
        "id":"calles",
        "label":"Salas de Emergencia",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/calles",
        "id":"calles",
        "label":"Escuelas Primarias",
        "opacity":0.5,
      },
      {
        "type":"",
        "url":"",
        "id":"red-agua",
        "label":"Escuelas Secundarias",
        "opacity":0.5,
      },
      {
        "type":"shape",
        "url":"data/calles",
        "id":"calles",
        "label":"Farmacias",
        "opacity":0.5,
      },  
    ], 
  }
];

initMap();
</script>

</body>
</html>
