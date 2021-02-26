import { getGloves } from "../../service/fetchingService.js"

const showGloves = async({ render }) => {
    render("gloves.ejs", { gloves: getGloves() });
}

 export { showGloves }