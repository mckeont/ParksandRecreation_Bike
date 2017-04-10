
// Setting up our map
var map = L.map('map', {
  center: [39.987614, -75.163913],
  zoom: 11,
});

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// var map = [];
//
// $(document).ready(function() {
//Original
//'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
// var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
//     thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>',
//     stamenLink = '<a href="http://maps.stamen.com/#terrain">Stamen</a>';
//
// var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     osmAttrib = '&copy; ' + osmLink + ' Contributors',
//     landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
//     thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink,
//     stamenUrl= 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
//     stamenAttrib= '&copy; '+osmLink+' Contributors & '+ stamenLink;
//
// var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
//     landMap = L.tileLayer(landUrl, {attribution: thunAttrib}),
//     stamenMap= L.tileLayer(stamenUrl, {attribution: stamenAttrib});
//
// var map = L.map('map', {
//   layers: [osmMap] // only add one!
// })
// .setView([39.9522, -75.1639], 14);
// });
