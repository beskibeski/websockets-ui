import { httpServer } from "./src/http_server/index";
import webServer from "./src/ws_server/index";

const HTTP_PORT = process.env.HTTP_PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

webServer.start();