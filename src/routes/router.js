import { Router } from "express"
import moviesRouter from "./moviesRouter.js"
import genresRouter from "./genresRouter.js"
import directorsRouter from "./directorsRouter.js"

const router = Router()

router.get("/", (req, res) => res.redirect("/movies"))
router.use("/movies", moviesRouter)
router.use("/genres", genresRouter)
router.use("/directors", directorsRouter)

export default router
