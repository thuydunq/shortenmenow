import app from "./App";

let serverPort = app.get('config').server.port;
const server = app.listen(serverPort, function(){
    console.log('Server listening on port 3000');
});