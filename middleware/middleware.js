import { send } from "../deps.js"

const errorMiddleware = async(context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}

/* Clothes could maybe be stored in the session which would lower the loading
    time but the site might be expanded and so in that case, saving the clothes in the session
    might not be such a good idea.
    But manufacturers are still used almost everywhere. Might be a good idea to store them as they appear.
*/

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