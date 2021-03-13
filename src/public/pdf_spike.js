//. pdf-sample.js
var fs = require( 'fs' ),
    pdf = require( 'pdf-parse' );

// default render callback
function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: true,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false
  }

  return pageData.getTextContent(render_options)
  .then(function(textContent) {
    let lastY, text = '';
    for (let item of textContent.items) {
      console.log(item.str)
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += '\n' + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  });
}

let options = {
  pagerender: render_page
}

if( process.argv.length > 1 ){
  var filename = process.argv[2];
  var buf = fs.readFileSync( filename );
  pdf(buf, options).then( function( data ){
    var text = data.text;
    console.log( text );
  }).catch( function( err ){
    console.log( err );
  });
}else{
  console.log( 'Usage: $ node pdf-sample ' );
}
