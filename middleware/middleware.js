import { send } from "../deps.js"
//Middleware making sure the server doesn't crash
const errorMiddleware = async(context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}
//Serving the .css file
const serveStaticFile = async(context,  next) => {
    if(context.request.url.pathname.startsWith("/static")){
        const path = context.request.url.pathname.substring(7);

        await send(context, path, {
            root: `${Deno.cwd()}/static`
        });
    } else {
        await next();
    }
}

export { errorMiddleware, serveStaticFile }