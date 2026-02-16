import {Router} from "express"
import directorsContoller from "../controllers/directorsController.js"

const router = Router()

router.get("/", directorsContoller.getDirectors)
router.get("/:id", directorsContoller.getDirector)
router.post("/new", directorsContoller.postDirector)
router.post("/:id/delete", directorsContoller.deleteDirector)
router.post("/:id/edit", directorsContoller.updateDirector)


export default router