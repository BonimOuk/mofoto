mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: mofoto.geometry.coordinates,
  zoom: 8,
});

new mapboxgl.Marker().setLngLat(mofoto.geometry.coordinates).addTo(map);
