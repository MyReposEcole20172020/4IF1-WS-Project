//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recupererPremierEnfantDeTypeNode(n) {
    var x = n.firstChild;
    while (x.nodeType != 1) { // Test if x is an element node (and not a text node or other)
        x = x.nextSibling;
    }
    return x;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant à l'URL relative donné dans le paramètreet le retourne
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function infosCountry(xmlDocumentUrl,xslDocumentUrl,newElementName,elReplace,pays){    
    var xsltProcessor = new XSLTProcessor();

    // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone 
    var xslDocument = chargerHttpXML(xslDocumentUrl);

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);
    xsltProcessor.setParameter('','pays',pays);

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);    

    // Création du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(elReplace);
    
    // Premier élément fils du parent
    var elementHtmlARemplacer = recupererPremierEnfantDeTypeNode(elementHtmlParent);
    // Premier élément "elementName" du nouveau document (par exemple, "ul", "table"...)
    var elementAInserer = newXmlDocument.getElementsByTagName(newElementName)[0];

    // Remplacement de l'élément
    elementHtmlParent.replaceChild(elementAInserer, elementHtmlARemplacer);

}


function loadSVG(svgDocumentUrl,newElementName,elReplace){
    // Chargement du fichier svg à l'aide de XMLHttpRequest synchrone 
    var newSvgDocument = chargerHttpXML(svgDocumentUrl);
    // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(elReplace);
     // Premier élément fils du parent
    var elementHtmlARemplacer = recupererPremierEnfantDeTypeNode(elementHtmlParent);
    // Premier élément "elementName" du nouveau document (par exemple, "ul", "table"...)
    var elementAInserer = newSvgDocument.getElementsByTagName(newElementName)[0];
    // Remplacement de l'élément
    elementHtmlParent.replaceChild(elementAInserer, elementHtmlARemplacer);

    return elementAInserer;

}

function colorSVG(svg, regionsXML){
    var regions = regionsXML.getElementsByTagName("fantastic_region");
    for (var i = 1; i < regions.length; i++) {

        var color = regions[i].getElementsByTagName("color")[0].innerHTML;

        var countries = regions[i].getElementsByTagName("real_country");
        
        var idCountries = [];
        for (var j = 0; j<countries.length;j++) {
            idCountries[j] = countries[j].getAttribute("id");
        }
        
        for(var j=0;j<idCountries.length;j++) {
            svg.getElementById(idCountries[j]).style.fill="white";
            svg.getElementById(idCountries[j]).style.opacity="1";
        }
    }
}

function displaySVG(svgDocumentUrl,regionsXMLDocumentUrl,newElementName,elReplace){
    var svg = loadSVG(svgDocumentUrl,newElementName,elReplace);
    var regionsXML = chargerHttpXML(regionsXMLDocumentUrl);
    colorSVG(svg, regionsXML);
}

//-----------------------------------------------------------
function clickEvent(){

    //var elementHtmlParent = window.document.getElementById(clickEvent.countryNameDisplay);

    var id = this.getAttribute("id");

    var xml = chargerHttpXML("fantastic_regions_countries.xml");
    var country = xml.getElementById(id);
    var regionName = country.parentElement.getElementsByTagName("name")[0].innerHTML;

    goToRegionList(regionName);
    //elementHtmlParent.innerHTML = "Clicked on :</br>Country : " + this.getAttribute("title") + "</br>Region : " + regionName;
    
}

function clickableMap(map,countryNameDisplay){
    var pays= recupererPremierEnfantDeTypeNode(window.document.getElementById(map)).children[1].children;
    //console.log(pays);
    for(i=0;i<pays.length;i++){
        clickEvent.countryNameDisplay = countryNameDisplay;
        pays[i].addEventListener('click',clickEvent);
        
    }
}

//----------------------------------------------------------

function highLight(idRegion,svg){    

    var idCountries = getRegionCountries("fantastic_regions_countries.xml",idRegion);

    for(i=0;i<idCountries.length;i++){

        //svg.getElementById(idCountries[i]).style.fill="green";
        svg.getElementById(idCountries[i]).style.fill='orangered';
        svg.getElementById(idCountries[i]).style.opacity="0.6";
    }
}

function lowLight(idRegion,svg){    

    var color = getColorFromCountryId("fantastic_regions_countries.xml",idRegion);
    var idCountries = getRegionCountries("fantastic_regions_countries.xml",idRegion);

    for(i=0;i<idCountries.length;i++){

        //svg.getElementById(idCountries[i]).style.fill="lightgrey";
        svg.getElementById(idCountries[i]).style.fill='white';
        svg.getElementById(idCountries[i]).style.opacity="1";     
    }
}

function getRegionFromCountryId(xmlDocumentUrl,id){
    var xml = chargerHttpXML(xmlDocumentUrl);
    var country = xml.getElementById(id);
    var idRegion = country.parentElement.getAttribute("id");
    return idRegion;
}

function getColorFromCountryId(xmlDocumentUrl,id){
    var xml = chargerHttpXML(xmlDocumentUrl);
    var country = xml.getElementById(id);
    var color = country.parentElement.getElementsByTagName("color")[0].innerHTML;
    return color;
}

function getRegionCountries(xmlDocumentUrl,idRegion){
    var xml = chargerHttpXML(xmlDocumentUrl);
    var countries = xml.getElementById(idRegion).getElementsByTagName("real_country");
    var idCountries = [];
    for (var i = 0; i<countries.length;i++) {
        idCountries[i] = countries[i].getAttribute("id");
    }
    return idCountries;
}

function MouseOverEvent(){
    
    var id = this.getAttribute("id");
    var svg = this.ownerSVGElement;

    var idRegion = getRegionFromCountryId("fantastic_regions_countries.xml",id);

    if(idRegion != MouseOverEvent.regionId && MouseOverEvent.regionId != null){
        lowLight(MouseOverEvent.regionId, svg);
    }

    highLight(idRegion, svg);

    var xml = chargerHttpXML("fantastic_regions_countries.xml");
    var country = xml.getElementById(id);
    var regionName = country.parentElement.getElementsByTagName("name")[0].innerHTML;
    window.document.getElementById('region').innerHTML = regionName;

    MouseOverEvent.regionId = idRegion;

}

function MouseLeaveEvent(){

    // var elementHtmlParent = window.document.getElementById(MouseOverEvent.mouseOverDisplay);

    var svg = this.ownerSVGElement;

    var id = this.getAttribute("id");
    var idRegion = getRegionFromCountryId("fantastic_regions_countries.xml",id);
    
    if(MouseOverEvent.regionId != idRegion){
        // setTimeout(function() {
            lowLight(idRegion,svg);
            this.removeAttribute("tooltip");
        // }, 0)
    }
}

function overableMap(map,mouseOverDisplay){
    var pays= recupererPremierEnfantDeTypeNode(window.document.getElementById(map)).children[1].children;
    //console.log(pays);
    for(i=0;i<pays.length;i++){
    //console.log(pays[i]);
        MouseOverEvent.mouseOverDisplay = mouseOverDisplay;
        // MouseLeaveEvent.mouseOverDisplay = mouseOverDisplay;
        pays[i].addEventListener('mouseover',MouseOverEvent);
        pays[i].addEventListener('mouseleave',MouseLeaveEvent);
        
    }    
}


function download(filename, html) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:Application/octet-stream,' + encodeURIComponent(html));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadXML(xml){
    xml = new XMLSerializer().serializeToString(xml);
    download('file.xml',xml);
}

function processAndDownloadXML(xmlDocumentUrl,xslDocumentUrl){
    var xsltProcessor = new XSLTProcessor();
    var xslDocument = chargerHttpXML(xslDocumentUrl);
    xsltProcessor.importStylesheet(xslDocument);

    var xml = chargerHttpXML(xmlDocumentUrl);
    var newXmlDocument = xsltProcessor.transformToDocument(xml);

    downloadXML(newXmlDocument);
}


function createCountriesTable(){
    var xml = chargerHttpXML('worldHigh.svg');
    var countries = xml.getElementsByTagName("path");

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var id = country.getAttribute("id");
        var title = country.getAttribute("title");
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(id));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(title));
        tr.appendChild(td);

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);

    return tbl;
}

function createAndDownloadCountriesTable(){
    var tbl = createCountriesTable();

    html = new XMLSerializer().serializeToString(tbl);
    download('countries.html',html);
}

function displayCountries(){

    var body = window.document.getElementById('countriesTable');

    var tbl = createCountriesTable();

    body.appendChild(tbl);
    
}

function makeRequest(query, keyWord, nodes, meta, first=false) {
    for(i=0;i<nodes.length;i++){
        if(!first || i!= 0){
            query+=keyWord;
        }
        query+='{';
        switch(nodes[i].tagName)
        {
            case "a":
                query+= '?out a ' + nodes[i].innerHTML;
                break;
            case "similar":
                query+= '?out ' + meta.getElementsByTagName(nodes[i].tagName)[0].innerHTML + ' ?c. ?c ' +  meta.getElementsByTagName(nodes[i].tagName)[0].innerHTML + ' ?out.';
                break;
            case "complex":
                query+= '?out ' + meta.getElementsByTagName(nodes[i].children[0].tagName)[0].innerHTML + ' ' + nodes[i].children[0].innerHTML + '.\n'; 
                query+= '?out a ' + nodes[i].children[1].innerHTML;
                break;
            default:
                query+= '?out ' + meta.getElementsByTagName(nodes[i].tagName)[0].innerHTML + ' ' + nodes[i].innerHTML + '.'; 
                break;
        }
        query+='}\n';
    }
    return query;
}

function addFilterNotExists(query, nodes, meta){
    for(i=0;i<nodes.length;i++){
        query+='FILTER NOT EXISTS {';
        query+=nodes[i].innerHTML + ' ' + meta.getElementsByTagName(nodes[i].tagName)[0].innerHTML + ' ?out'
        query+='}.\n';
    }
    return query;
}

function addFilterDiff(query, nodes, meta){
    for(i=0;i<nodes.length;i++){
        query+='FILTER (';
        query+= '?out != <' + nodes[i].innerHTML + '>';
        query+=').\n';
    }
    return query;
}

function addFilterRegex(query, nodes){
	for(i=0;i<nodes.length;i++){
		query+='FILTER(regex(?out,' + nodes[i].innerHTML + ')).\n';
	}
	return query;
}

function addPrefix(nodes){
	var query = 'PREFIX ';
	console.log(nodes);
	for(i=0;i<nodes.length;i++){
		if(i>0)
		{
			query+=' , '
		}
		query+= nodes[i].tagName + ':<' + nodes[i].innerHTML + '>';
	}
	query+='\n';
	return query;
}

function makeQuery(xmlDocumentUrl) {

    var xml = chargerHttpXML(xmlDocumentUrl);
    
    var meta = xml.getElementsByTagName("meta")[0];
    var requete = xml.getElementsByTagName("requete")[0];
	var prefix = xml.getElementsByTagName("prefix")[0].children;

	var query=addPrefix(prefix);
	
    query += 'SELECT DISTINCT ?out WHERE {{\n';
    
    var unionChildren = requete.getElementsByTagName("union")[0].children;
    query=makeRequest(query,'UNION',unionChildren,meta,true);
    
    var minusChildren = requete.getElementsByTagName("minus")[0].children;
    query=makeRequest(query,'MINUS',minusChildren,meta);
    query+='}';
    var filterNotExChildren = requete.getElementsByTagName("filterNotEx")[0].children;
    query=addFilterNotExists(query,filterNotExChildren,meta);
    
    var filterDiffChildren = requete.getElementsByTagName("filterDiff")[0].children;
    query=addFilterDiff(query,filterDiffChildren,meta);
	
    var filterRegexChildren = requete.getElementsByTagName("filterRegex")[0].children;
	query=addFilterRegex(query,filterRegexChildren);
	
	if(requete.getElementsByTagName("filterURI").length != 0)
	{
		query+='FILTER(ISURI(?out))';
	}
	
    query+='}';
    console.log(query);
}


function importCreatures(filename){

}

function sortCreaturesByRegion(creaturesXMLDocumentUrl,regionsXMLDocumentUrl){
    var creaturesXML = chargerHttpXML(creaturesXMLDocumentUrl);
    var regionsXML = chargerHttpXML(regionsXMLDocumentUrl);

}

function goToRegionList(value) {

    var xml = chargerHttpXML("fantastic_regions_countries.xml");
    var regions = xml.getElementsByTagName("fantastic_region");
    for (var i = 0; i<regions.length;i++) {
        if(value == regions[i].getElementsByTagName("name")[0].innerHTML){
            var url='results_region.html?myVariable='+value;
            document.location.href = url;
            return 0;
        }
    }
    
}
