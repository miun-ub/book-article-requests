/* ====================================================================================
Script som fyller i formuläret på https://biblioteket.miun.se/bestall-en-bok
med metadata från beställningslänkar från LIBRIS och SFX-fönster 
==================================================================================== */

var url = document.referrer;

// ====================== Länkar från LIBRIS ====================== 
// Länkar från LIBRIS innehåller inga metadata förutom LIBRIS-ID
// Exempel: http://libris.kb.se/bib/11284491?tab2=ill
// För att hämta metadata använder api:et Xsearch,  http://librishelp.libris.kb.se/help/xsearch_swe.jsp?open=tech


  if (url.includes('?tab2=ill')) {

      url = url.slice(url.lastIndexOf('/') + 1, url.indexOf('?'));
      url = 'https://libris.kb.se/xsearch?query=' + url + '&format=xml';
      $.get(url, function(data) {

          $(data).find('record').first().each(function() {
              $('.field:eq(6)').attr('value', $(this).find('datafield[tag=245]').text());
              $('.field:eq(7)').attr('value', $(this).find('datafield[tag=100] subfield[code=a]').text());
              $('.field:eq(8)').attr('value', $(this).find('datafield[tag=250] subfield[code=a]').text());
              $('.field:eq(9)').attr('value', $(this).find('datafield[tag=260] subfield[code=c]').text());
              $('.field:eq(10)').attr('value', $(this).find('datafield[tag=020] subfield[code=a]').text());
          });
      })
              $('.field:eq(11)').attr('value', document.referrer)
  }


// ====================== SFX-länkar från databaser  ====================== 
// Metadata till beställningsformuläret hämtas från SFX-länken
// Exempel: https://biblioteket.miun.se/bestall-en-artikel?&openurl=HTTP://sfxeu11.hosted.exlibrisgroup.com/sfxmiu?genre=bookitem&isbn=0791448851&doi=&issn=&title=Ladies%20&%20gentlemen,%20boys%20&%20girls:%20gender%20in%20film%20at%20the%20end%20of%20the%20twentieth%20century&volume=&issue=&date=20010101&atitle=%27Real%20Men%20Don%27t%20Sing%20and%20Dance%27%3A%20growing%20up%20male%20with%20the%20Hollywood%20musical%20-%20a%20memoir&aulast=Jowett,%20Garth&spage=149&sid=EBSCO:Gender%20Studies%20Database&pid=
// API se: https://developers.exlibrisgroup.com/sfx/apis/Deep_Links/CitationLinker/	


  if (url.includes('sfxeu11')) {

  url = decodeURIComponent(url);
  var arr = url.split('&');

    var author = '', surname = '', firstname = '';
    for (var i = 0; i < arr.length; i++) {

     if (arr[i].includes('title=')) {
      $('.field:eq(6)').attr('value', arr[i].slice(arr[i].indexOf('=') + 1));
     }
     if (arr[i].includes('date=')) {
      $('.field:eq(9)').attr('value', arr[i].slice(arr[i].indexOf('=') + 1, 9));
     }
     if (arr[i].includes('isbn=')) {
      $('.field:eq(10)').attr('value', arr[i].slice(arr[i].indexOf('=') + 1));
     }
     if (arr[i].includes('sid=')) {
      $('.field:eq(11)').attr('value', arr[i].slice(arr[i].indexOf('=') + 1));
     }
     if (arr[i].includes('au=')) {
      author = arr[i].slice(arr[i].indexOf('=') + 1);
     }
     if (arr[i].includes('aulast=')) {
      surname = arr[i].slice(arr[i].indexOf('=') + 1);
     }
     if (arr[i].includes('aufirst=')) {
      firstname = arr[i].slice(arr[i].indexOf('=') + 1);
     }
    }

    // hantera författare
    if (author.length < 1) {
     $('.field:eq(7)').attr('value', surname.toUpperCase() + ' ' + firstname);
    } else {
     $('.field:eq(7)').attr('value', author);
    }
  }
