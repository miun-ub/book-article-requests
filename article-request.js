/* ====================================================================================
Script som fyller i formuläret på https://biblioteket.miun.se/bestall-en-artikel
med metadata från SFX-fönster 
==================================================================================== */

var url = window.location.href;


//  Skicka bokbeställningar från SFX-länkar till formulär för bokbeställning

if (url.includes('genre=book')) {
location.assign("https://biblioteket.miun.se/bestall-en-bok");
}


// ARTIKELBESTÄLLNING  


url = decodeURIComponent(url);

if (url.includes('genre=article')) {

	
// ====================== SFX-länkar från PubMed  ====================== 
// SFX-länkar från PubMed innehåller inga metadata utöver pmid-nummer. 
// Exempel: http://sfxeu11.hosted.exlibrisgroup.com/sfxmiu?sid=Entrez:PubMed&rft_id=info:pmid/30342932
// För att hämta metadata använder vi ett öppet api från 
// NCBI Entrez system, https://www.ncbi.nlm.nih.gov/books/NBK25501/

	
if (url.includes('sid=Entrez'))  {
  var pmid = url.slice(url.indexOf('pmid/')+5, url.indexOf('&org'));
  var   url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + pmid + "&retmode=xml";
	
 $.get(url, function(data) {

      $(data).find('DocSum').each(function() {		   
		$(".field:eq(6)").attr('value', $(this).find('Item[Name=FullJournalName]').text());
		$(".field:eq(7)").attr('value', $(this).find('Item[Name=ISSN]').text());
		$(".field:eq(8)").attr('value', $(this).find('Item[Name=Title]').text());
		$(".field:eq(9)").attr('value', $(this).find('Item[Name=Author]').first().text());
		$(".field:eq(10)").attr('value', $(this).find('Item[Name=PubDate]').text());
		$(".field:eq(11)").attr('value', $(this).find('Item[Name=Volume]').text());
		$(".field:eq(12)").attr('value', $(this).find('Item[Name=Issue]').text());
		$(".field:eq(13)").attr('value', $(this).find('Item[Name=Pages]').text());
		$(".field:eq(16)").attr('value', $(this).find('Item[Name=SO]').text());
      });
    })
		$(".field:eq(15)").attr('value', 'https://www.ncbi.nlm.nih.gov/pubmed/' + pmid);
 }
	
	
// ====================== SFX-länkar från övriga databaser  ====================== 
// Metadata till beställningsformuläret hämtas från SFX-länken
// Exempel: https://biblioteket.miun.se/bestall-en-artikel?&openurl=HTTP://sfxeu11.hosted.exlibrisgroup.com/sfxmiu?genre=article&isbn=&doi=10.1080%2F14725886.2018.1521182&issn=14725886&title=Journal%20of%20Modern%20Jewish%20Studies&volume=18&issue=1&date=20190201&atitle=Towards%20an%20anthropology%20of%20doubt%3A%20the%20case%20of%20religious%20reproduction%20in%20Orthodox%20Judaism&aulast=Taragin-Zeller%2C%20Lea&spage=1&sid=EBSCO%3AAtla%20Religion%20Database&pid=&organisation=&rft_genre=article&libris_issn=1472-5886&libris_eissn=1472-5894&libris_isbn=&language=English
// API se: https://developers.exlibrisgroup.com/sfx/apis/Deep_Links/CitationLinker/	
	
    else {
      
var arr = url.split('&');

var firstname = '', surname = '', author = '', startpage= '', endpage = '', pages = '', journal ='', journaltitle ='';

for (var i = 0; i < arr.length; i++) {

    	if (arr[i].includes('issn=')) {
       		$(".field:eq(7)").attr('value', arr[i].slice(arr[i].indexOf('=')+1));  
    	}
	if (arr[i].includes('atitle=')) {
		$(".field:eq(8)").attr('value', arr[i].slice(arr[i].indexOf('=')+1));
   	}
    	if (arr[i].includes('date=')) {
		$(".field:eq(10)").attr('value', arr[i].slice(arr[i].indexOf('=')+1, 9));
    	}
	if (arr[i].includes('volume=')) {
        	$(".field:eq(11)").attr('value', arr[i].slice(arr[i].indexOf('=')+1));
    	}
	if (arr[i].includes('issue=')) {
        	$(".field:eq(12)").attr('value', arr[i].slice(arr[i].indexOf('=')+1));	
    	}
	if (arr[i].includes('sid=')) {
        	$(".field:eq(15)").attr('value', arr[i].slice(arr[i].indexOf('=')+1)); 
    	}
	if (arr[i].includes('isbn=')) {
        	$(".field:eq(16)").attr('value', arr[i].slice(arr[i].indexOf('=')+1));
    	}
    	if (arr[i].includes('spage=')) {
        	startpage = arr[i].slice(arr[i].indexOf('=')+1);
   	}
    	if (arr[i].includes('epage=')) {
        	endpage = arr[i].slice(arr[i].indexOf('=')+1);
    	}
	if (arr[i].includes('pages=')) {
        	pages = arr[i].slice(arr[i].indexOf('=')+1);
    	}
    	if (arr[i].includes('au=')) {
        	author = arr[i].slice(arr[i].indexOf('=')+1);
    	}
    	if (arr[i].includes('aulast=')) {
		 surname = arr[i].slice(arr[i].indexOf('=')+1);
    	}
    	if (arr[i].includes('aufirst=')) {
		 firstname = arr[i].slice(arr[i].indexOf('=')+1);
    	}
	if (arr[i].includes('jtitle=')) {
		journaltitle = arr[i].slice(arr[i].indexOf('=')+1);
    	}
	if (arr[i].substr(0,6) == 'title=' ) {
	 	journal = arr[i].slice(arr[i].indexOf('=')+1);
	}
}

// hantera sidor, tidskriftstitel och författare


	if (journaltitle.length > journal.length ) {
		journal = journaltitle;
	}	
	if (author.length < 1 ) {
		author = surname.toUpperCase() + ' ' + firstname;
	}
	if (pages.length < 1 ) {
		pages = startpage + '-' + endpage;
	}
		$(".field:eq(6)").attr('value', journal);
		$(".field:eq(9)").attr('value', author);
		$(".field:eq(13)").attr('value', pages);
    }
}
