import {Router} from "express"
import moviesContoller from "../controllers/moviesContoller.js"

const router = Router()

router.get("/", moviesContoller.getMovies)
router.get("/new", moviesContoller.newMovie)
router.get("/:id/edit", moviesContoller.editMovie)
router.get("/:id", moviesContoller.getMovie)
router.post("/:id/delete", moviesContoller.deleteMovie)
router.post("/new", moviesContoller.postMovie)
router.post("/:id/edit", moviesContoller.updateMovie)


export default router