/* Filling mapping */
var map = [];

var val = parent.document.URL.substring(parent.document.URL.indexOf('=') + 1, parent.document.URL.length); //Get variable in URL
val = decodeURI(val);
val = val.replace(/%20/g, ' '); // Replace %20 strings with white spaces

$("document").ready(function () {

    $("#name").append(val);
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
            $('#image').remove();
            } else {
            $(resultats.results.bindings).each( function(i) {
                var result = resultats.results.bindings[i].out.value;
                $("#image").append('<img src="' + result + '" />');
          });
        }
        
      });
}

function insertSubject(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dct:subject' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    var fetching = $.when();

    fetching = fetching.pipe(function () {
        return $.getJSON(myurl + "&callback=?", function (resultats) {

            if (resultats.results.bindings.length == 0) {
                $('#subject').prev().remove();
                //$('#subject').append('<span>Subject not found</span>');
            } else {
                $(resultats.results.bindings).each(function (i) {
                    var result = resultats.results.bindings[i].out.value;
                    
                    $("#subject").append(   
                                            '<h4 id="' + i + '">' + result + '</h4>');

                });
            }

        });
    });

    fetching.done(function () {
        $('#subject h4').each(function(index){
            var result = $(this).text();
            var element = $(this);

            var query2 = result.replace('Category:', '');
            query2 = 'SELECT DISTINCT ?out WHERE {<' + query2 + '> ' + 'rdfs:comment' + ' ?out. FILTER(lang(?out) = "en").}';
            console.log("\n\n\n" + query2 + "\n\n\n");
            var myurl2 = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query2 + '&output=json';                
            $.getJSON(myurl2 + "&callback=?", function (resultats) {

                if (resultats.results.bindings.length == 0) {
                    //element.parent.remove();
                } else {
                    $(resultats.results.bindings).each(function (i) {
                        var result = resultats.results.bindings[i].out.value;
                        result = result.replace(/_/g, ' ');
                        element.wrap('<div class="accordion"></div>');
                        element.after('<div>'+ result+'</div>');
                        element.attr('class','plegable');

                        $('.accordion').accordion({
                            // Slide animation or not or length
                            animate: 100,
                            // Starting tab
                            active: false,
                            // Collapsible if same tab is clicked
                            collapsible: true,
                            // Event that triggers
                            event: "click",
                            // Height based on content (content) or largest (auto)
                            heightStyle: "content"
                        });
                    });
                }
    
            });

            result = result.substring(result.lastIndexOf(':') + 1);
            result = result.replace(/_/g, ' ');
            $("#subject #"+index).text(result);

        });

        
        
    });

}

                    
                    

function insertGroup(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:grouping' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#group').prev().remove();
            //$('#group').append('<span>Group not found</span>');
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
            $('#comment').prev().remove();
            //$('#comment').append('<span>Comment not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                //result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#comment").append("<text>" + result + "<br /><text>");
            });
        }

    });
}

function insertGender(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'foaf:gender' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#gender').prev().remove();
            //$('#gender').append('<span>Gender not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#gender").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertBasedOn(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {{?out dbp:basedOn <' + subject + '>} UNION '
                                           +'{?out dbo:basedOn <' + subject + '>}  UNION '
                                           +'{<' + subject + '> dbp:based ?out.} UNION '
                                           +'{?out dbp:based <' + subject + '>}}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#basedOn').prev().remove();
            //$('#basedOn').append('<span>Based on not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#basedOn").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertFirstAppearance(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbo:firstAppearance' + ' ?out.}'
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#firstAppearance').prev().remove();
            //$('#firstAppearance').append('<span>First appearance not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#firstAppearance").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertCountry(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:country' + ' ?out.}'
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#country').prev().remove();
            //$('#country').append('<span>Country not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#country").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertRegion(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:region' + ' ?out.}'
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#region').prev().remove();
            //$('#region').append('<span>Region not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#region").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertHabitat(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:habit' + ' ?out.}';
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    var fetching = $.when();

    fetching = fetching.pipe(function () {
        return $.getJSON(myurl + "&callback=?", function (resultats) {

            if (resultats.results.bindings.length == 0) {
                $('#habitat').prev().remove();
                //$('#habitat').append('<span>Subject not found</span>');
            } else {
                $(resultats.results.bindings).each(function (i) {
                    var result = resultats.results.bindings[i].out.value;
                    
                    $("#habitat").append(   
                                            '<h4 id="' + i + '">' + result + '</h4>');

                });
            }

        });
    });

    fetching.done(function () {
        $('#habitat h4').each(function(index){
            var result = $(this).text();
            var element = $(this);

            var query2 = result.replace('Category:', '');
            query2 = 'SELECT DISTINCT ?out WHERE {<' + query2 + '> ' + 'rdfs:comment' + ' ?out. FILTER(lang(?out) = "en").}';
            console.log("\n\n\n" + query2 + "\n\n\n");
            var myurl2 = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query2 + '&output=json';                
            $.getJSON(myurl2 + "&callback=?", function (resultats) {

                if (resultats.results.bindings.length == 0) {
                    //element.parent.remove();
                } else {
                    $(resultats.results.bindings).each(function (i) {
                        var result = resultats.results.bindings[i].out.value;
                        result = result.replace(/_/g, ' ');
                        element.wrap('<div class="accordion"></div>');
                        element.after('<div>'+ result+'</div>');
                        element.attr('class','plegable');

                        $('.accordion').accordion({
                            // Slide animation or not or length
                            animate: 100,
                            // Starting tab
                            active: false,
                            // Collapsible if same tab is clicked
                            collapsible: true,
                            // Event that triggers
                            event: "click",
                            // Height based on content (content) or largest (auto)
                            heightStyle: "content"
                        });
                    });
                }
    
            });

            result = result.substring(result.lastIndexOf('/') + 1);
            result = result.replace(/_/g, ' ');
            $("#habitat #"+index).text(result);

        });

        
        
    });

}

/*
function insertHabitat(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:habit' + ' ?out.}'
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#habitat').prev().remove();
            //$('#habitat').append('<span>Habitat not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#habitat").append("<item>" + result + "<br /><item>");
            });
        }

    });
}
*/

function insertMythology(subject) {

    var query = 'SELECT DISTINCT ?out WHERE {<' + subject + '> ' + 'dbp:mythology' + ' ?out.}'
    console.log("\n\n\n" + query + "\n\n\n");
    query = encodeURIComponent(query);
    var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';

    $.getJSON(myurl + "&callback=?", function (resultats) {

        if (resultats.results.bindings.length == 0) {
            $('#mythology').prev().remove();
            //$('#mythology').append('<span>Mythology not found</span>');
        } else {
            $(resultats.results.bindings).each(function (i) {
                var result = resultats.results.bindings[i].out.value;
                result = result.substring(result.lastIndexOf('/') + 1);
                result = result.replace(/_/g, ' ');
                $("#mythology").append("<item>" + result + "<br /><item>");
            });
        }

    });
}

function insertSimilarCreatures(subject) {

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