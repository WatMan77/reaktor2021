import { getBeanies } from "../../service/fetchingService.js"

const showBeanies = async({ render }) => {
    render("beanies.ejs", {beanies: getBeanies() });
}

export { showBeanies }