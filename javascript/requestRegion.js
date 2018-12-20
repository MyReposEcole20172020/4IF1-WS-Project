/* Filling mapping */
var map = [];

var val = parent.document.URL.substring(parent.document.URL.indexOf('=') + 1, parent.document.URL.length); //Get variable in URL
val = decodeURI(val);
val = val.replace(/%20/g, ' '); // Replace %20 strings with white spaces
var region = '';

$("document").ready(function () {

    fillMapping2();
    var xml = chargerHttpXML("fantastic_regions_countries.xml");
    var regions = xml.getElementsByTagName("fantastic_region");
    
    for (var i = 0; i<regions.length;i++) {
        if(val == regions[i].getElementsByTagName("name")[0].innerHTML){
            region=regions[i];
        }
    }
    
    $('#resultRegion').append('<item>' + region.getElementsByTagName("name")[0].innerHTML + '</item>');
    $('.lds-spinner').append('<p style="color:white;">Loading...</p>')

    insertListCreatures();

});

function insertListCreatures() {

    var fetching = $.when();

    dbpCountries = region.getElementsByTagName('dbpedia_country');
    dbpRegions = region.getElementsByTagName('dbpedia_region');
    dbpRegex = region.getElementsByTagName('dbpedia_regex');
    var query = '';
    
        for (var i = 0; i < dbpCountries.length; i++) {
            query = '';
            if(dbpCountries[i].innerHTML.charAt(0) != '"'){
                query = 'UNION  { ?out dbp:country dbr:' + dbpCountries[i].innerHTML + '.';
                query = addConstraints(query);
                query = 'select distinct ?out where {' + query.substring(6,query.length) + '}';
                console.log("\n\n\n" + query + "\n\n\n");

                query = encodeURIComponent(query);


                var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';
                
                $.getJSON(myurl + "&callback=?", function (resultats) {
        
                    if (resultats.results.bindings.length == 0) {
                        //window.document.getElementById('listCreatures').innerHTML='<p style="color:red">Not found</p>';
                    } else {
                        $(resultats.results.bindings).each(function (i) {
                            var result = resultats.results.bindings[i].out.value;
                            var label = result.substring(result.lastIndexOf('/') + 1);
                            if (label.indexOf('(') != -1) {
                                label = label.substring(0, label.indexOf('('));
                            }
                            if (label.lastIndexOf('_') == (label.length - 1)) {
                                label = label.substring(0, label.lastIndexOf('_'));
                            }
                            label = label.replace(/_/g, ' ');
                            result = 'results.html?myVariable=' + label;
                            if (findURI3(map, label) == 0) {
                                //$("#similarCreatures").append('<a>' + label + '<br /></a>');
                            } else {
                                $("#listCreatures").append('<a class="list" href="' + result + '">' + label + '<br /></a>');
                            }
        
                        });
                    }
        
                });
            

            } else if (dbpRegions[i].innerHTML.charAt(0) == '"'){
                query = 'UNION  { ?out dbp:country ' + dbpRegions[i].innerHTML +'^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>.';
                alert(query);
                query = addConstraints(query);
                alert(dbpRegions[i].innerHTML.substring(1,dbpRegions[i].innerHTML.length - 1));

                query = 'select distinct ?out where {' + query.substring(6,query.length) + '}';
                console.log("\n\n\n" + query + "\n\n\n");
                query = encodeURIComponent(query);


                var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';
                
                $.getJSON(myurl + "&callback=?", function (resultats) {
        
                    if (resultats.results.bindings.length == 0) {
                        //window.document.getElementById('listCreatures').innerHTML='<p style="color:red">Not found</p>';
                    } else {
                        $(resultats.results.bindings).each(function (i) {
                            var result = resultats.results.bindings[i].out.value;
                            var label = result.substring(result.lastIndexOf('/') + 1);
                            if (label.indexOf('(') != -1) {
                                label = label.substring(0, label.indexOf('('));
                            }
                            if (label.lastIndexOf('_') == (label.length - 1)) {
                                label = label.substring(0, label.lastIndexOf('_'));
                            }
                            label = label.replace(/_/g, ' ');
                            result = 'results.html?myVariable=' + label;
                            if (findURI3(map, label) == 0) {
                                //$("#similarCreatures").append('<a>' + label + '<br /></a>');
                            } else {
                                $("#listCreatures").append('<a class="list" href="' + result + '">' + label + '<br /></a>');
                            }
        
                        });
                    }
        
                }); 
            
            }
        }

        for (var i = 0; i < dbpRegions.length; i++) {
            if(dbpRegions[i].innerHTML.charAt(0) != '"'){
                query = 'UNION  { ?out dbp:country dbr:' + dbpRegions[i].innerHTML +'.';
                query = addConstraints(query);
                query = 'select distinct ?out where {' + query.substring(6,query.length) + '}';
                console.log("\n\n\n" + query + "\n\n\n");
                query = encodeURIComponent(query);


                var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';
                $.getJSON(myurl + "&callback=?", function (resultats) {
        
                    if (resultats.results.bindings.length == 0) {
                        //window.document.getElementById('listCreatures').innerHTML='<p style="color:red">Not found</p>';
                    } else {
                        $(resultats.results.bindings).each(function (i) {
                            var result = resultats.results.bindings[i].out.value;
                            var label = result.substring(result.lastIndexOf('/') + 1);
                            if (label.indexOf('(') != -1) {
                                label = label.substring(0, label.indexOf('('));
                            }
                            if (label.lastIndexOf('_') == (label.length - 1)) {
                                label = label.substring(0, label.lastIndexOf('_'));
                            }
                            label = label.replace(/_/g, ' ');
                            result = 'results.html?myVariable=' + label;
                            if (findURI3(map, label) == 0) {
                                //$("#similarCreatures").append('<a>' + label + '<br /></a>');
                            } else {
                                $("#listCreatures").append('<a class="list" href="' + result + '">' + label + '<br /></a>');
                            }
        
                        });
                    }
        
                }); 

            } else if(dbpRegions[i].innerHTML.charAt(0) == '"'){
                query = 'UNION  { ?out dbp:country ' + dbpRegions[i].innerHTML +'^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>.';
                query = addConstraints(query);

                query = 'select distinct ?out where {' + query.substring(6,query.length) + '}';
                console.log("\n\n\n" + query + "\n\n\n");
                query = encodeURIComponent(query);


                var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';
                
                $.getJSON(myurl + "&callback=?", function (resultats) {
        
                    if (resultats.results.bindings.length == 0) {
                        //window.document.getElementById('listCreatures').innerHTML='<p style="color:red">Not found</p>';
                    } else {
                        $(resultats.results.bindings).each(function (i) {
                            var result = resultats.results.bindings[i].out.value;
                            var label = result.substring(result.lastIndexOf('/') + 1);
                            if (label.indexOf('(') != -1) {
                                label = label.substring(0, label.indexOf('('));
                            }
                            if (label.lastIndexOf('_') == (label.length - 1)) {
                                label = label.substring(0, label.lastIndexOf('_'));
                            }
                            label = label.replace(/_/g, ' ');
                            result = 'results.html?myVariable=' + label;
                            if (findURI3(map, label) == 0) {
                                //$("#similarCreatures").append('<a>' + label + '<br /></a>');
                            } else {
                                $("#listCreatures").append('<a class="list" href="' + result + '">' + label + '<br /></a>');
                            }
        
                        });
                    }
        
                });
            }
        }
        
        for (var i = 0; i < dbpRegex.length; i++) {
                query = 'UNION { ?out foaf:name ?name. FILTER regex(str(?name), "'+dbpRegex[i].innerHTML+'", "i").';
                query = addConstraints(query);

                query = 'select distinct ?out where {' + query.substring(6,query.length) + '}';
                console.log("\n\n\n" + query + "\n\n\n");
                query = encodeURIComponent(query);


                var myurl = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&output=json';
                
             $.getJSON(myurl + "&callback=?", function (resultats) {
        
                    if (resultats.results.bindings.length == 0) {
                        //window.document.getElementById('listCreatures').innerHTML='<p style="color:red">Not found</p>';
                    } else {
                        $(resultats.results.bindings).each(function (i) {
                            var result = resultats.results.bindings[i].out.value;
                            var label = result.substring(result.lastIndexOf('/') + 1);
                            if (label.indexOf('(') != -1) {
                                label = label.substring(0, label.indexOf('('));
                            }
                            if (label.lastIndexOf('_') == (label.length - 1)) {
                                label = label.substring(0, label.lastIndexOf('_'));
                            }
                            label = label.replace(/_/g, ' ');
                            result = 'results.html?myVariable=' + label;
                            if (findURI3(map, label) == 0) {
                                //$("#listCreatures").append('<a>' + label + '<br /></a>');
                            } else {
                                $("#listCreatures").append('<a class="list" href="' + result + '">' + label + '<br /></a>');
                            }
        
                        });
                    }
        
                });
    

    }

    $("#loading").remove();
    
}

function addConstraints(query){
    base = query;
    query = query + '?out dct:subject dbc:Wolves_in_Norse_mythology.}';
    query = query + base +  ' ?out dct:subject dbc:Supernatural_legends. ?out a dbo:FictionalCharacter.}';
    query = query + base +  ' ?out dbp:grouping dbr:Legendary_creature.}';
    query = query + base +  ' ?out dct:subject dbc:Greek_legendary_creatures.}';
    query = query + base +  ' ?out dct:subject dbc:Monsters.}';
    query = query + base +  ' ?out dct:subject dbc:Albanian_mythology}';
    query = query + base +  ' ?out dct:subject dbc:African_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Female_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Heraldic_beasts}';
    query = query + base +  ' ?out dct:subject dbc:Chinese_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Dragons}';
    query = query + base +  ' ?out dct:subject dbc:Asian_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Irish_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Fairies}';
    query = query + base +  ' ?out dct:subject dbc:Medieval_European_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Horses_in_Norse_mythology}';
    query = query + base +  ' ?out a yago:WikicatCreaturesInNorseMythology}';
    query = query + base +  ' ?out dct:subject dbc:Japanese_legendary_creatures. ?b a dbo:FictionalCharacter}';
    query = query + base +  ' ?out dct:subject dbc:Mythological_hybrids}';
    query = query + base +  ' ?out dct:subject dbc:Egyptian_legendary_creatures}';
    query = query + base +  ' ?out dct:subject dbc:Slavic_legendary_creatures.}';
    query = query + base +  ' ?out dct:subject dbc:Mythological_dogs}';
    query = query + base +  ' ?out dct:subject dbc:South_American_legendary_creatures}';

    return query;
}


function findURI3(map, value) {
    for (var i in map) {
        if (map[i].key == value) {
            return map[i].uri;
        }
    }
    return 0;
}

function fillMapping2() {
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

function chargerHttpXML(xmlDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3° paramètre est défini à false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}