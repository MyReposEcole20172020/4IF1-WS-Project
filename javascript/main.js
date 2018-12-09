$("document").ready(function() {
    $("#result").css("color","white");
  });

  $("#search").keyup(function() {
    var value = $(this).val();
  });

  var query = 'SELECT DISTINCT ?pays WHERE {?pays dbp:populationCensus ?population}';
  var newquery = encodeURIComponent(query);
  var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ newquery +'&output=json';
  $.getJSON(url+"&callback=?", function(resultats) {
    $(resultats.results.bindings).each(function(i) {
      $('#result').append("<p>" + resultats.results.bindings[i].pays.value + "</p>");
    }); 
  });

function goToResults() {
  var url = "results.html";
  document.location.href = url;
}

function goToIndex() {
  var url = "index.html";
  document.location.href = url;
}