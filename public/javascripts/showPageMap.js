mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: mofoto.geometry.coordinates,
  zoom: 8,
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(mofoto.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${mofoto.title}</h3><p>${mofoto.location}</p>`
    )
  )
  .addTo(map);
