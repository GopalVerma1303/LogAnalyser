const net = require("net");

const server = net.createServer();

server.on("connection", (clientToProxySocket) => {
  console.log("Client connected to proxy");

  clientToProxySocket.once("data", (data) => {
    let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
    let serverPort = 80;
    let serverAddress;
    let fullUrl;

    console.log(data.toString());

    if (isTLSConnection) {
      serverPort = 443;
      serverAddress = data
        .toString()
        .split("CONNECT")[1]
        .split(" ")[1]
        .split(":")[0];
      fullUrl = `https://${serverAddress}`;
    } else {
      const lines = data.toString().split("\r\n");
      const hostLine = lines.find((line) => line.startsWith("Host: "));
      serverAddress = hostLine.split("Host: ")[1];
      const endpoint = lines[0].split(" ")[1];
      fullUrl = `http://${serverAddress}${endpoint}`;
    }

    console.log(serverAddress);
    console.log(`Full URL: ${fullUrl}`);

    // Creating a connection from proxy to destination server
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

    if (isTLSConnection) {
      clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else {
      proxyToServerSocket.write(data);
    }

    clientToProxySocket.pipe(proxyToServerSocket);
    proxyToServerSocket.pipe(clientToProxySocket);

    proxyToServerSocket.on("error", (err) => {
      console.log("Proxy to server error");
      console.log(err);
    });

    clientToProxySocket.on("error", (err) => {
      console.log("Client to proxy error");
      console.log(err);
    });
  });
});

server.on("error", (err) => {
  console.log("Some internal server error occurred");
  console.log(err);
});

server.on("close", () => {
  console.log("Client disconnected");
});

server.listen(
  {
    host: "0.0.0.0",
    port: 8080,
  },
  () => {
    console.log("Server listening on 0.0.0.0:8080");
  },
);
