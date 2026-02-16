import {Router} from "express"
import genresContoller from "../controllers/genresController.js"

const router = Router()

router.get("/", genresContoller.getGenres)
router.get("/delete", genresContoller.deleteGenre)
router.get("/:id", genresContoller.getGenre)
router.post("/new", genresContoller.postGenre)
router.post("/update", genresContoller.updateGenre)


export default router