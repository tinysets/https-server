process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var tls = require('tls');
var fs = require('fs');
const PORT = 56565;
const HOST = 'localhost'
// Pass the certs to the server and let it know to process even unauthorized certs.
var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    rejectUnauthorized: false
};
var client = tls.connect(PORT, HOST, options, function () {
    // Check if the authorization worked
    if (client.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + client.authorizationError)
    }
    // Send a friendly message
    client.write("I am the client sending you a message.");
});
client.on("data", function (data) {
    console.log('Received: %s [it is %d bytes long]',
        data.toString().replace(/(\n)/gm, ""),
        data.length);
    // Close the connection after receiving the message
    client.end();
});
client.on('close', function () {
    console.log("Connection closed");
});
// When an error ocoures, show it.
client.on('error', function (error) {
    console.error(error);
    // Close the connection after the error occurred.
    client.destroy();
});