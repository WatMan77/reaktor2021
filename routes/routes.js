import { Router } from "../deps.js"
import { showRoot } from "./controller/rootController.js";
import { showGloves } from "./controller/glovesController.js";
import { showBeanies } from "./controller/beaniesController.js"
import { showMasks } from "./controller/masksController.js"

const router = new Router();

router.get('/', showRoot);
router.get('/gloves', showGloves);
router.get("/beanies", showBeanies);
router.get("/masks", showMasks);

export { router }