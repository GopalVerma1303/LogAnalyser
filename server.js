const net = require("net");

// Create a new server
const server = net.createServer();

// Handle a new client connection
server.on("connection", (clientToProxySocket) => {
  console.log("Client connected to proxy");

  // Handle data received from the client
  clientToProxySocket.once("data", (data) => {
    let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
    let serverPort = 80;
    let serverAddress;
    let fullUrl;

    console.log(data.toString());

    // Determine if the connection is TLS
    if (isTLSConnection) {
      serverPort = 443;
      serverAddress = data
        .toString()
        .split("CONNECT")[1]
        .split(" ")[1]
        .split(":")[0];
      fullUrl = `https://${serverAddress}`;
    } else {
      // Parse the HTTP request
      const lines = data.toString().split("\r\n");
      const hostLine = lines.find((line) => line.startsWith("Host: "));
      serverAddress = hostLine.split("Host: ")[1];
      const endpoint = lines[0].split(" ")[1];
      fullUrl = `http://${serverAddress}${endpoint}`;
    }

    console.log(serverAddress);
    console.log(`Full URL: ${fullUrl}`);

    // Create a connection from the proxy to the destination server
    let proxyToServerSocket = net.createConnection(
      {
        host: serverAddress,
        port: serverPort,
      },
      () => {
        console.log("Proxy to server set up");
        console.log(`Visiting URL: ${fullUrl}`);
      },
    );

    // Handle the TLS connection
    if (isTLSConnection) {
      clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else {
      // Forward the client data to the server
      proxyToServerSocket.write(data);
    }

    // Pipe the client data to the server and vice versa
    clientToProxySocket.pipe(proxyToServerSocket);
    proxyToServerSocket.pipe(clientToProxySocket);

    // Handle errors in the proxy to server connection
    proxyToServerSocket.on("error", (err) => {
      console.log("Proxy to server error");
      console.log(err);
    });

    // Handle errors in the client to proxy connection
    clientToProxySocket.on("error", (err) => {
      console.log("Client to proxy error");
      console.log(err);
    });
  });
});

// Handle internal server errors
server.on("error", (err) => {
  console.log("Some internal server error occurred");
  console.log(err);
});

// Handle the server closing
server.on("close", () => {
  console.log("Client disconnected");
});

// Start the server
server.listen(
  {
    host: "0.0.0.0",
    port: 8080,
  },
  () => {
    console.log("Server listening on 0.0.0.0:8080");
  },
);
