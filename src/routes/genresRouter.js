import {Router} from "express"
import genresContoller from "../controllers/genresController.js"

const router = Router()

router.get("/", genresContoller.getGenres)
router.get("/:id", genresContoller.getGenre)
router.post("/new", genresContoller.postGenre)
router.post("/:id/delete", genresContoller.deleteGenre)
router.post("/:id/edit", genresContoller.updateGenre)


export default router