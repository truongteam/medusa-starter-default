import cors from "cors"
import { projectConfig } from "../../../medusa-config"

const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
}

export default cors(adminCorsOptions)
