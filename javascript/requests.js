/* Filling mapping */
var map = [];

var val = parent.document.URL.substring(parent.document.URL.indexOf('=') + 1, parent.document.URL.length); //Get variable in URL
val = val.replace(/%20/g, ' '); // Replace %20 strings with white spaces

$("document").ready(function () {

    fillMapping();
    var inputURI = findURI2(map, val);

    insertImage(inputURI);
    insertSubject(inputURI);
    insertGroup(inputURI);
    insertComment(inputURI);
    insertGender(inputURI);
    insertBasedOn(inputURI);
    insertFirstAppearance(inputURI);
    insertCountry(inputURI);
    insertRegion(inputURI);
    insertHabitat(inputURI);
    insertMythology(inputURI);
    insertSimilarCreatures(inputURI);

});
    
function insertImage(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'foaf:depiction' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ query +'&output=json';

    $.getJSON(myurl + "&callback=?", function(resultats) {

        if(resultats.results.bindings.length == 0 ) {
            $('#image').append('<span>Image not found</span>'); 
        } else {
            $(resultats.results.bindings).each( function(i) {
                var result = resultats.results.bindings[i].out.value;
                $("#image").append("<img src='" + result + "' />");
          });
        }
        
      });
}

function insertSubject(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dct:subject' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#subject').append('<span>Subject not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf(':') + 1);
                result = result.replace(/_/g, ' ');
                $("#subject").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertGroup(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:grouping' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#group').append('<span>Group not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#group").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertComment(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'rdfs:comment' + ' ?out. FILTER(lang(?out) = "en").}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#comment').append('<span>Comment not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#comment").append("<text>" + result + "<br /><text>");
            });
        }

    });
}

function insertComment(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'rdfs:comment' + ' ?out. FILTER(lang(?out) = "en").}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#comment').append('<span>Comment not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#comment").append("<text>" + result + "<br /><text>");
            });
        }

    });
}

function findURI2(map, value) {
    for (var i in map) {
        if (map[i].key == value) {
            return map[i].uri;
        }
    }
    return 0;
}

function fillMapping() {
    var data = readXML();
    $(data).find('uri').each(function (i) {
        var uri = $(this).text();
        var name = uri.substring(uri.lastIndexOf('/') + 1);
        if (name.indexOf('(') != -1) {
            name = name.substring(0, name.indexOf('('));
        }
        if (name.lastIndexOf('_') == (name.length - 1)) {
            name = name.substring(0, name.lastIndexOf('_'));
        }
        name = name.replace(/_/g, ' ');
        var object = { 'key': name, 'uri': uri };
        map.push(object);
    });
}
