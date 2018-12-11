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

  /* Get variable sent from index html */
  var image = parent.document.URL.substring(parent.document.URL.indexOf('=')+1, parent.document.URL.length);
  var imagequery = 'SELECT DISTINCT ?image WHERE {dbr:Vampire foaf:depiction ?image.}';
    imagequery = encodeURIComponent(imagequery);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ imagequery +'&output=json';
    $.getJSON(myurl+"&callback=?", function(resultats) {
    $(resultats.results.bindings).each(function(i) {
    var imagesrc = resultats.results.bindings[i].image.value;
  $("#result").append('<img src="'+ image +'">');
  });
  });

});

/* Search value */
var value;
$("#search").keyup(function() {
  value = $(this).val();
});

/* Query */

var query = 'SELECT DISTINCT ?pays WHERE {?pays dbp:populationCensus ?population}';
var newquery = encodeURIComponent(query);
var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ newquery +'&output=json';
$.getJSON(url+"&callback=?", function(resultats) {
  $(resultats.results.bindings).each(function(i) {
    var item = resultats.results.bindings[i].pays.value;
    item = item.substring(item.lastIndexOf('/') + 1);
    $('#result').append("<p>" + item + "</p>");
    
  });
});

/*
var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
      $.getJSON(flickerAPI, {
          tags: "mount everest",
          tagmode: "any",
          format: "json"
      }, function (data) {
          alert("success");
      });
      return false;*/

/* Redirecting */

function goToResults() {
    var url='results.html?myVariable='+value;
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

/*
var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ newquery +'&output=xml&callback=?';
function getXmlFromFile() {
  $.ajax({
    type: "GET",
    crossDomain: true,
    url: url,
    datatype: "xml",
    success: createXmlFile,
    error: loadfail});
}

function createXmlFile(data){
  $(data).find('uri').each(function(){
    var uri = $(this).find('uri').text();
    autocompleteOptions.push(uri);
  });
}*/
   
/*function setAutocompleteOptions(data) {
  $(data).find('creature').each(function(){
    var id = $(this).attr('id');
    var name = $(this).find('name').text();
    autocompleteOptions.push(name);
  });
}*/

function readXML(){
  var mYxmlObject = new XMLHttpRequest();
  mYxmlObject.open("GET", "data/creatures.xml", false);
  mYxmlObject.send(null);
  return mYxmlObject.responseXML;
}

function setAutocompleteOptions() {
  var data = readXML();
  $(data).find('uri').each(function(){
    var text = $(this).text();
    var name = text.substring(text.lastIndexOf('/') + 1);
    if(name.indexOf('(') != -1) {
      name = name.substring(0,name.indexOf('('));
    }
    if(name.lastIndexOf('_') == (name.length-1)) {
      name = name.substring(0,name.lastIndexOf('_'));
    }
    name = name.replace(/_/g,' ');
    autocompleteOptions.push(name);
  });
}
