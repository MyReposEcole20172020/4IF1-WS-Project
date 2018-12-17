/* Initialize */

var autocompleteOptions = [];
var mapping = [];

$("document").ready(function() {
    
  $("#description").css("color","white");
  $("#result").html($("#description"));

  $( function() {   
    $( "#search" ).autocomplete({
      source: autocompleteOptions,
      minLength: 2,
      select: function (event, ui) {
        autoCompleteSelectHandler(event, ui)}
    });
  });
  
  setAutocompleteOptions();

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

/* Retrieving data from XML file */

function readXML(){
  var mYxmlObject = new XMLHttpRequest();
  mYxmlObject.open("GET", "data/TestSimilar.xml", false);
  mYxmlObject.send(null);
  return mYxmlObject.responseXML;
}

function setAutocompleteOptions() {
  var data = readXML();
  $(data).find('uri').each(function(i){
    var text = $(this).text();
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
