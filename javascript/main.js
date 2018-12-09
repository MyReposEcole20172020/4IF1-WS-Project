$("document").ready(function() {
    $("#second").hide();
    $("#result").css("color","white");
  });

  $(".btn-search").click(function(){
    $("#first").hide();
    $("#second").show();
  });

  $(".btn-back").click(function(){
    $("#first").show();
    $("#second").hide();
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