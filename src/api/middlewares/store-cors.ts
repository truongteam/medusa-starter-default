import cors from "cors"
import { projectConfig } from "../../../medusa-config"

const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
}

export default cors(storeCorsOptions)
