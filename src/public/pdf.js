//. pdf-sample.js
var fs = require( 'fs' ),
    pdf = require( 'pdf-parse' );

if( process.argv.length > 1 ){
  var filename = process.argv[2];
  var buf = fs.readFileSync( filename );
  pdf( buf ).then( function( data ){
    var text = data.text;
    console.log( text );
  }).catch( function( err ){
    console.log( err );
  });
}else{
  console.log( 'Usage: $ node pdf-sample ' );
}
