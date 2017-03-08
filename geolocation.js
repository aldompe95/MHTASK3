// Markers feature
let labels = 'ABC';
let labelIndex = 0;

const maxMarkersInMap = 3;
let countMarkersInMap = 0;

let markers = [];
let markersCoordinates = [];

let map;

function initMap(){
  let colima = { lat: 19.2453576, lng: -103.7317546 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: colima
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event){
    addMarker(event.latLng, map);
  });
}

// Adds a marker to the map.
function addMarker(location, map){
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  let marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
  markersCoordinates.push(location); // Save the direction of the marker
  markers.push(marker);
}

google.maps.event.addDomListener(window, 'load', initMap);