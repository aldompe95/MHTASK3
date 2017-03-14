// Initialize Firebase
var config = {
  apiKey: "AIzaSyCybD9Dz8BnIe4y8tcfkpsUeaTY8ORggCY",
  authDomain: "flawless-sorter-160721.firebaseapp.com",
  databaseURL: "https://flawless-sorter-160721.firebaseio.com",
  storageBucket: "flawless-sorter-160721.appspot.com",
  messagingSenderId: "1014964712512"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Save locations in db
function writeMarkers(markers) {
  let marker1 = `${markers[0].lat()}, ${markers[0].lng()}`;
  let marker2 = `${markers[1].lat()}, ${markers[1].lng()}`;
  let marker3 = `${markers[2].lat()}, ${markers[2].lng()}`;
  firebase.database().ref('markers/' ).push({
    location1: marker1,
    location2: marker2,
    location3: marker3
  });
  printMenuOfLocations();
}

// variable for the locations of the db
let locationsDB = [];
function getLocationsFromDb(){
  var getLocations = firebase.database().ref('markers/');
  getLocations.on('child_added', markers => {
    locationsDB.push(markers.val());
  });
}

function printMenuOfLocations(){
  let html = '<table><tr><th>ID</th><th>Point A</th><th>Point B</th><th>Point C</th></tr>';
  locationsDB.map((locations, i) =>{
    html += `<tr><td class="setDbMarkers" id="${i}"><button class="btn orange waves-effect waves-light">setMap</button></td><td>${locations.location1}</td><td>${locations.location2}</td><td>${locations.location3}</td></tr>`;
  });
  html += '</table>';
  document.querySelector('.savedMarkers').innerHTML = html;

  let dbMarkers = document.querySelectorAll('.setDbMarkers');
  [].forEach.call(dbMarkers, function(marker){
    marker.addEventListener('click', evt => {
      console.log(this);
    });
  });
}

// Markers feature
let labels = 'ABC';
let labelIndex = 0;

const maxMarkersInMap = 3;
let countMarkersInMap = 0;

let markers = [];
let markersCoordinates = [];

let map;

let notification = new Audio('bip.wav');
let streetViewService = new google.maps.StreetViewService();
let STREET_VIEW_MAXDISTANCE = 200;

function initMap(){
  let colima = { lat: 19.2453576, lng: -103.7317546 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: colima
  });
  changeStreetView(colima, map);
  getLocationsFromDb();
  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event){
    if(countMarkersInMap < maxMarkersInMap){ // user cant set more than 3 markers
      notification.play();
      addMarker(event.latLng, map);
      countMarkersInMap++;
      changeStreetView(event.latLng, map);
    }else{
      alert("There already 3 markers in map");
    }
  });
}

function changeStreetView(location, map) {
  streetViewService.getPanoramaByLocation(location, STREET_VIEW_MAXDISTANCE, checkPanorama);
}

function checkPanorama(data, status) {
  if (status == google.maps.StreetViewStatus.OK) {
    let panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
    panorama.setPano(data.location.pano);
    panorama.setVisible(true);
  } else {
    console.error('Street View data not found for this location.');
  }
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
  removeLines();
}

google.maps.event.addDomListener(window, 'load', initMap);

// Distance feature
function printDistance(){
  if(markersCoordinates.length == 3){
    let html;
    html = `<li class="collection-item grey lighten-3"> Marker A to marker B: ${getDistanceFromLatLonInKm(markersCoordinates[0],markersCoordinates[1])} KM</li>`;
    html += `<li class="collection-item grey lighten-3"> Marker A to marker C: ${getDistanceFromLatLonInKm(markersCoordinates[0],markersCoordinates[2])} KM</li>`;
    html += `<li class="collection-item grey lighten-3"> Marker B to marker C: ${getDistanceFromLatLonInKm(markersCoordinates[1],markersCoordinates[2])} KM</li>`;
    document.querySelector('#output').innerHTML = html;
    markersCoordinates.push(markersCoordinates[0]);
    drawLines();
  }else{
    alert("You must select at least 3 locations");
  }
}

function getDistanceFromLatLonInKm(pointA, pointB){
  let distanceInM = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
  const metersInKm = 1000;
  let distanceInKm = distanceInM / metersInKm;
  return distanceInKm;
}

let line;
// DrawLines feature
function drawLines(){
  markersCoordinates.push(markersCoordinates[0]);
  line = new google.maps.Polyline({
    path: markersCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  line.setMap(map);
}

function removeLines(){
  line.setMap(null);
}
