// 'use strict';

// var http = require('http');
// var express = require('express');
// var bodyparser = require('body-parser');
// var mongoose = require('mongoose');
// var passport = require('passport');
// var cors = require('cors');
// // Config
// var app = express();

// app.use(cors());

// app.use(express.static(__dirname + '/build'));
// app.use(bodyparser.json());

// mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost/sextant');

// // Auth
// app.set('jwtTokenSecret', process.env.JWT_SECRET || 'changeMeChangeMeChangeMe');
// app.set('secret', process.env.SECRET || 'changeMeChangeMeChangeMe'); // We never actually use this; passport just requires it

// app.use(passport.initialize());
// require('./lib/auth/passport')(passport);

// // Routing
// var jwtAuth = require('./lib/auth/jwt-auth')(app);

// require('./routes/user-routes')(app, passport);
// require('./routes/data-routes')(app, jwtAuth.auth);

// // Init
// var server = http.createServer(app);
// app.set('port', process.env.PORT || 3000);
// exports.port = app.get('port');

// server.listen(app.get('port'),function(){
//   console.log('Server has started on port %d', app.get('port'));
// });



// Include our HTTP module.
var http = require( "http" );
 
 
// Create an HTTP server so that we can listen for, and respond to
// incoming HTTP requests. This requires a callback that can be used
// to handle each incoming request.
var server = http.createServer(
    function( request, response ){
 
 
        // When dealing with CORS (Cross-Origin Resource Sharing)
        // requests, the client should pass-through its origin (the
        // requesting domain). We should either echo that or use *
        // if the origin was not passed.
        var origin = (request.headers.origin || "*");
 
 
        // Check to see if this is a security check by the browser to
        // test the availability of the API for the client. If the
        // method is OPTIONS, the browser is check to see to see what
        // HTTP methods (and properties) have been granted to the
        // client.
        if (request.method.toUpperCase() === "OPTIONS"){
 
 
            // Echo back the Origin (calling domain) so that the
            // client is granted access to make subsequent requests
            // to the API.
            response.writeHead(
                "204",
                "No Content",
                {
                    "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept",
                    "access-control-max-age": 10, // Seconds.
                    "content-length": 0
                }
            );
 
            // End the response - we're not sending back any content.
            return( response.end() );
 
 
        }
 
 
        // -------------------------------------------------- //
        // -------------------------------------------------- //
 
 
        // If we've gotten this far then the incoming request is for
        // our API. For this demo, we'll simply be grabbing the
        // request body and echoing it back to the client.
 
 
        // Create a variable to hold our incoming body. It may be
        // sent in chunks, so we'll need to build it up and then
        // use it once the request has been closed.
        var requestBodyBuffer = [];
 
        // Now, bind do the data chunks of the request. Since we are
        // in an event-loop (JavaScript), we can be confident that
        // none of these events have fired yet (??I think??).
        request.on(
            "data",
            function( chunk ){
 
                // Build up our buffer. This chunk of data has
                // already been decoded and turned into a string.
                requestBodyBuffer.push( chunk );
 
            }
        );
 
 
        // Once all of the request data has been posted to the
        // server, the request triggers an End event. At this point,
        // we'll know that our body buffer is full.
        request.on(
            "end",
            function(){
 
                // Flatten our body buffer to get the request content.
                var requestBody = requestBodyBuffer.join( "" );
 
                // Create a response body to echo back the incoming
                // request.
                var responseBody = (
                    "Thank You For The Cross-Domain AJAX Request:\n\n" +
                    "Method: " + request.method + "\n\n" +
                    requestBody
                );
 
                // Send the headers back. Notice that even though we
                // had our OPTIONS request at the top, we still need
                // echo back the ORIGIN in order for the request to
                // be processed on the client.
                response.writeHead(
                    "200",
                    "OK",
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                        "content-length": responseBody.length
                    }
                );
 
                // Close out the response.
                return( response.end( responseBody ) );
 
            }
        );
 
 
    }
);
 
 
// Bind the server to port 8080.
server.listen( 8080 );
 
 
// Debugging:
console.log( "Node.js listening on port 8080" );