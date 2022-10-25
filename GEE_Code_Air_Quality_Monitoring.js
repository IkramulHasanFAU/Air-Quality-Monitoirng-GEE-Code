
var CA = <Import California Shapefile>
var O3 = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_O3")
var CO = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_CO");
Map.addLayer(CA); 
Map.centerObject(CA,10);
// Filtering date and cliping images to AOI, selecting band and taking month as a time unit
var imageCA = CO.filterBounds(CA)
.filterDate('2020-01-01','2020-12-31')
.select('CO_column_number_density')
.map(function(a) {
return a.set('month',ee.Image(a).date().get('month'))
})
.mean()
.clip(CA);
// setting Image visualization parameters based on CO concentration 
print(imageCA);
var Iviz = {
  min: 0,
  max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};
// displaying CA_co concentration map on the code editor 
Map.addLayer(imageCA,Iviz,'CA_co concentration map');
// Exporting CA carbon monooxide concentration map to Google Drive 
Export.image.toDrive({
  image: imageCA,
  description: 'CA CO concentration Map',
  region: CA, 
  scale: 5000,
  skipEmptyTiles: true,
  maxPixels: 1e13});

//plotting CO Time Series Chart by  month  
var col_CO = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_CO")
.filterBounds(CA)
.filterDate('2020-01-01','2021-01-01')
.select('CO_column_number_density')
.map(function(a) {
return a.set('month',ee.Image(a).date().get('month'))
});

var months = ee.List(col_CO.aggregate_array('month')).distinct();

var mc = months.map(function(x) {
  return col_CO.filterMetadata('month','equals',x).mean().set('month',x) 
});
var final_image = ee.ImageCollection.fromImages(mc);
print(final_image);
  
var chartCO = ui.Chart.image.series(final_image,CA,ee.Reducer.mean(),5000,'month')
.setOptions({
  title:"CO Concentration in CA", 
  vAxis: {title:"concentration in mol/m^2"},
  hAxis: {title:"month" }
  });
print (chartCO);


// plotting O3 Time Series Chart by month


var col_O3 = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_O3")
.filterBounds(CA)
.filterDate('2020-01-01','2021-01-01')
.select('O3_column_number_density')
.map(function(a) {
return a.set('month',ee.Image(a).date().get('month'))
});

var months = ee.List(col_O3.aggregate_array('month')).distinct();

var mc = months.map(function(x) {
  return col_O3.filterMetadata('month','equals',x).mean().set('month',x) 
});
var final_image = ee.ImageCollection.fromImages(mc);
print(final_image);
  
var chartO3 = ui.Chart.image.series(final_image,CA,ee.Reducer.mean(),5000,'month')
.setOptions({
  title:"O3 Concentration in CA", 
  vAxis: {title:"concentration in mol/m^2"},
  hAxis: {title:"month" }
  });
print (chartO3);