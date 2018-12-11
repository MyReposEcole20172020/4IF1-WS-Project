/* Initialize */

var autocompleteOptions = [];
var mapping = [];

var data;

$("document").ready(function() {
    
  $("#result").css("color","white");
  $("#description").hide();

  $( function() {   
    $( "#search" ).autocomplete({
      source: autocompleteOptions,
      select: function (event, ui) {
        autoCompleteSelectHandler(event, ui)}
    });
  });
  
  setAutocompleteOptions();

  /* Get variable sent from index html */
  var image = parent.document.URL.substring(parent.document.URL.indexOf('=')+1, parent.document.URL.length);
  image = image.replace(/%20/g,' ');
  var imagequery = findURI(mapping,image);
  imagequery = 'SELECT DISTINCT ?image WHERE {<' + imagequery + '> foaf:depiction ?image.}';
  console.log("\n\n\n" +imagequery + "\n\n\n");
  imagequery = encodeURIComponent(imagequery);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ imagequery +'&output=json';
    $.getJSON(myurl+"&callback=?", function(resultats) {
    if(resultats.results.bindings.length == 0 ){
      $("#result").append('<p>Image not found</p>');    
    } else {
      $(resultats.results.bindings).each(function(i) {
        var imagesrc = resultats.results.bindings[i].image.value;
        $("#result").append('<img src="'+ imagesrc +'">');
      });
    }
  });

  $('#search').keypress(function(e){
    if(e.keyCode==13){
      e.preventDefault();
      $(".btn-search").click();
    }
  });

});



/* Search value */
var value;
$("#search").keyup(function() {
  value = $(this).val();
});

function autoCompleteSelectHandler(event, ui) {               
  value = ui.item.value;
}

/* Query */

/*var query = 'SELECT DISTINCT ?pays WHERE {?pays dbp:populationCensus ?population}';
var newquery = encodeURIComponent(query);
var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ newquery +'&output=json';
$.getJSON(url+"&callback=?", function(resultats) {
  $(resultats.results.bindings).each(function(i) {
    var item = resultats.results.bindings[i].pays.value;
    item = item.substring(item.lastIndexOf('/') + 1);
    $('#result').append("<p>" + item + "</p>");
    
  });
});*/

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
    if(findURI(mapping, value) == 0){
      $("#search").val('');
      $("#search").attr("placeholder","You must enter a valid name of a creature");
    } else {
      var url='results.html?myVariable='+value;
      document.location.href = url;
    }
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
  $(data).find('uri').each(function(i){
    var text = $(this).text();
    $('this').attr('id', i);
    var name = text.substring(text.lastIndexOf('/') + 1);
    if(name.indexOf('(') != -1) {
      name = name.substring(0,name.indexOf('('));
    }
    if(name.lastIndexOf('_') == (name.length-1)) {
      name = name.substring(0,name.lastIndexOf('_'));
    }
    name = name.replace(/_/g,' ');

    var object = { 'key' : name, 'uri' : text };

    autocompleteOptions.push(name);
    mapping.push(object);

  });
}

function findURI(mapping, value){
  for (var i in mapping){
    if(mapping[i].key == value){
      return mapping[i].uri;
    }
  }
  return 0;
}
