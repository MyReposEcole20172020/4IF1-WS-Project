/* Filling mapping */
var map = [];

var val = parent.document.URL.substring(parent.document.URL.indexOf('=') + 1, parent.document.URL.length); //Get variable in URL
val = decodeURI(val);
val = val.replace(/%20/g, ' '); // Replace %20 strings with white spaces

$("document").ready(function () {

    $("#name").append(val);
    fillMapping();
    var inputURI = findURI2(map, val);

    insertListCreatures(inputURI);

});

function insertListCreatures(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {{<' + subject + '> ' + 'dbp:similarCreatures' + ' ?out.} UNION '
                                            +'{?out dbp:similarCreatures <' + subject + '>}}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#similarCreatures').prev().remove();
            //$('#similarCreatures').append('<span>Similar creatures not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                console.log(result);
                var label = result.substring(result.lastIndexOf('/') + 1);
                if(label.indexOf('(') != -1) {
                    label = label.substring(0,label.indexOf('('));
                  }
                  if(label.lastIndexOf('_') == (label.length-1)) {
                    label = label.substring(0,label.lastIndexOf('_'));
                  }
                label = label.replace(/_/g, ' ');
                console.log(label);
                var myUrl =parent.document.URL.substring(0,parent.document.URL.lastIndexOf('=')+1); 
                result = myUrl + label;
                if(findURI2(map, label) == 0) {
                    $("#similarCreatures").append('<a>' + label + '<br /></a>');
                } else {
                    $("#similarCreatures").append('<a href="' + result + '">' + label + '<br /></a>');
                }
                
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
        var label = uri.substring(uri.lastIndexOf('/') + 1);
        if (label.indexOf('(') != -1) {
            label = label.substring(0, label.indexOf('('));
        }
        if (label.lastIndexOf('_') == (label.length - 1)) {
            label = label.substring(0, label.lastIndexOf('_'));
        }
        label = label.replace(/_/g, ' ');
        var object = { 'key': label, 'uri': uri };
        map.push(object);
    });
}