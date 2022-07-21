import cors from "cors"
import { projectConfig } from "../../../medusa-config"

const storeCorsOptions = {
    origin: projectConfig.store_cors.split(','),
    credentials: true,
}
export const storeMedusaCors = cors(storeCorsOptions);
export const corss = (req, res, next) => {
    res.setHeader('access-control-allow-origin', projectConfig.store_cors.split(','))
    res.setHeader("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
    res.setHeader("access-control-allow-credentials", "true"); // allows cookie to be sent
    res.setHeader("access-control-allow-methods", "GET, POST, PUT, HEAD, DELETE"); // you must specify the methods used with credentials. "*" will not work. 
    next()
}

export default (req, res, next) => {
    res.setHeader('access-control-allow-origin', projectConfig.store_cors.split(','))
    res.setHeader("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
    res.setHeader("access-control-allow-credentials", "true"); // allows cookie to be sent
    res.setHeader("access-control-allow-methods", "GET, POST, PUT, HEAD, DELETE"); // you must specify the methods used with credentials. "*" will not work. 
    res.status(200).end()
}
