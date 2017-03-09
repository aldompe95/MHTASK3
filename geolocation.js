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
    if(countMarkersInMap < maxMarkersInMap){ // user cant set more than 3 markers
      addMarker(event.latLng, map);
      countMarkersInMap++;
    }else{
      alert("There already 3 markers in map");
    }
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
  markers.push(marker); // Save the marker
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  markersCoordinates = [];
  countMarkersInMap = 0;
}

google.maps.event.addDomListener(window, 'load', initMap);

// Distance feature
function printDistance(){
  if(markersCoordinates.length == 3){
    let html;
    html = `<li> Marker A to marker B: ${getDistanceFromLatLonInKm(markersCoordinates[0].lat(),markersCoordinates[0].lng(),markersCoordinates[1].lat(),markersCoordinates[1].lng())}KM</li>`;
    html += `<li> Marker A to marker C: ${getDistanceFromLatLonInKm(markersCoordinates[0].lat(),markersCoordinates[0].lng(),markersCoordinates[2].lat(),markersCoordinates[2].lng())}KM</li>`;
    html += `<li> Marker A to marker C: ${getDistanceFromLatLonInKm(markersCoordinates[1].lat(),markersCoordinates[1].lng(),markersCoordinates[2].lat(),markersCoordinates[2].lng())}KM</li>`;
    document.querySelector('#output').innerHTML = html;
    markersCoordinates.push(markersCoordinates[0]);
    drawLines();
  }else{
    alert("You must select at least 3 locations");
  }
}
  
// Haversine formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg){
  return deg * (Math.PI/180)
}

// DrawLines feature
function drawLines(){
  markersCoordinates.push(markersCoordinates[0]);
  let line = new google.maps.Polyline({
    path: markersCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  line.setMap(map);
}