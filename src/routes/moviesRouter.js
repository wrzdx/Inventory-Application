import {Router} from "express"
import moviesContoller from "../controllers/moviesContoller.js"

const router = Router()

router.get("/", moviesContoller.getMovies)
router.get("/delete", moviesContoller.deleteMovie)
router.get("/:id", moviesContoller.getMovie)
router.post("/new", moviesContoller.postMovie)
router.post("/update", moviesContoller.updateMovie)


export default router