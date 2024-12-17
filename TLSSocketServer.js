process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var tls = require('tls');
var fs = require('fs');
const PORT = 46464;
const HOST = '127.0.0.1'
var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};
var server = tls.createServer(options, function (socket) {
    // Send a friendly message
    socket.write("I am the server sending you a message.");
    // Print the data that we received
    socket.on('data', function (data) {
        console.log('Received: %s [it is %d bytes long]',
            data.toString().replace(/(\n)/gm, ""),
            data.length);
    });
    // Let us know when the transmission is over
    socket.on('end', function () {
        console.log('EOT (End Of Transmission)');
    });
});
// Start listening on a specific port and address
server.listen(PORT, HOST, function () {
    console.log("I'm listening at %s, on port %s", HOST, PORT);
});
// When an error occurs, show it.
server.on('error', function (error) {
    console.error(error);
    // Close the connection after the error occurred.
    server.destroy();
});