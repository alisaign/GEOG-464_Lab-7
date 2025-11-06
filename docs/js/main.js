// declare the map variable here to give it a global scope
let myMap;




// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
);
const Stadia_Watercolor = L.tileLayer(
	'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
	{
		attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap contributors.'
	}
);



//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = {
	"CartoDB": CartoDB_Positron,
	"Stadia Watercolor": Stadia_Watercolor
};


function initialize(){
    loadMap();
};

function loadMap(mapid) {

	try {
		myMap.remove();
	} catch (e) {
		console.log("no map to delete");
	} finally {

		if (mapid === "mapa") {
			myMap = L.map('mapdiv', {
				center: [46.58, -78.19],
				zoom: 5,
				maxZoom: 18,
				minZoom: 3,
				layers: CartoDB_Positron
			});
			L.control.layers(baseLayers).addTo(myMap);
			fetchData("https://raw.githubusercontent.com/brubcam/GEOG-464_Lab-7/main/DATA/train-stations.geojson");
		}

		if (mapid === "mapb") {
			myMap = L.map('mapdiv', {
				center: [20, 0],
				zoom: 2,
				maxZoom: 18,
				minZoom: 2,
				layers: CartoDB_Positron
			});
			L.control.layers(baseLayers).addTo(myMap);
			fetchData("https://raw.githubusercontent.com/brubcam/GEOG-464_Lab-7/main/DATA/megacities.geojson");
		}

	}
}



function fetchData(url) {
	//load the data
	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (json) {
			//create a Leaflet GeoJSON layer using the fetched json and add it to the map object
			L.geoJson(json, { style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups }).addTo(myMap);
		})
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature) {
	// console.log(feature.properties.stat_ID);
	let styles = {
		stroke: true,
		color: '#000',
		opacity: 1,
		weight: 1,
		fillColor: '#fff',
		fillOpacity: 0.5,
		radius: 9
	};
	if (feature.properties.postal_code && feature.properties.postal_code !== "") {
		styles.fillColor = "cyan";
	}
	return styles;
}

function addPopups(feature, layer){
	// console.log(feature);
	// console.log(layer);
	// console.log(layer._radius)
	// console.log(layer.options.fill)
	// console.log(layer.getLatLng())
	// layer.options.fill = false
	// layer._radius = 80
	layer.bindPopup(feature.properties.stat_name);

}


// window.onload = initialize();