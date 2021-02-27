import { getMasks } from "../../service/fetchingService.js"

const showMasks = async({ render }) => {
    render("masks.ejs", { masks: getMasks() });
}

export { showMasks }