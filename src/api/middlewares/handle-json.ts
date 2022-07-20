import { Response } from "express"
const handleJSON = (res: Response) => data => res.json({ data })
export default handleJSON