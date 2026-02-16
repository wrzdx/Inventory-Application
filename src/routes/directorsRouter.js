import {Router} from "express"
import directorsContoller from "../controllers/directorsController.js"

const router = Router()

router.get("/", directorsContoller.getDirectors)
router.get("/delete", directorsContoller.deleteDirector)
router.get("/:id", directorsContoller.getDirector)
router.post("/new", directorsContoller.postDirector)
router.post("/update", directorsContoller.updateDirector)


export default router