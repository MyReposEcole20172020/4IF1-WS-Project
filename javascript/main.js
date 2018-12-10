/* Initialize */

var autocompleteOptions = [];

$("document").ready(function() {
    
  $("#result").css("color","white");
  $("#description").hide();

  $( function() {   
    $( "#search" ).autocomplete({
      source: autocompleteOptions
    });
  });
  
  setAutocompleteOptions();

  });

/* Search value */

$("#search").keyup(function() {
  var value = $(this).val();
});

/* Query */

var query = 'SELECT DISTINCT ?pays WHERE {?pays dbp:populationCensus ?population}';
var newquery = encodeURIComponent(query);
var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ newquery +'&output=json';
$.getJSON(url+"&callback=?", function(resultats) {
  $(resultats.results.bindings).each(function(i) {
    $('#result').append("<p>" + resultats.results.bindings[i].pays.value + "</p>");
  });
});

/* Redirecting */

function goToResults() {
  var url = "results.html";
  document.location.href = url;
}
function goToIndex() {
  var url = "index.html";
  document.location.href = url;
}

function goToMap() {
  var url = "map.html";
  document.location.href = url;
}

function displayTable() {
  $("#description").show();
  $("#result").html($("#description"));
}

/* Retrieving data from XML file */

function getXmlFromFile() {
  $.ajax({
    type: "GET",
    crossDomain: true,
    url: "data/data.xml",
    datatype: "xml",
    success: setAutocompleteOptions,
    error: loadfail});
  }
   
/*
function setAutocompleteOptions(data) {
  $(data).find('creature').each(function(){
    var id = $(this).attr('id');
    var name = $(this).find('name').text();
    autocompleteOptions.push(name);
  });
}

function loadfail(data) {
  alert("error");
}*/

function readXML(){
  var mYxmlObject = new XMLHttpRequest();
  mYxmlObject.open("GET", "data/data.xml", false);
  mYxmlObject.send(null);
  return mYxmlObject.responseXML;
}

function setAutocompleteOptions(data) {
  var data = readXML();
  $(data).find('creature').each(function(){
    var id = $(this).attr('id');
    var name = $(this).find('name').text();
    autocompleteOptions.push(name);
  });
}
