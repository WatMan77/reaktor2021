import  { Application, viewEngine, engineFactory, adapterFactory, Session} from "./deps.js"
import * as middleware from "./middleware/middleware.js"
import { router } from "./routes/routes.js"
import { updateItems } from "./service/fetchingService.js"

const app = new Application();
//setInterval(() => console.log("Moi"), 1000);
//await updateItems(false)
//setInterval(await updateItems(false), 1000*60*7);

const session = new Session({ framework: "oak"});
await session.init();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}))

app.use(session.use()(session));

app.use(middleware.errorMiddleware);
//app.use(middleware.sessionMiddleware);
app.use(middleware.serveStaticFile);

app.use(router.routes());

let port = 7777;
//Make sure Heroku uses the correct port
if (Deno.args.length > 0) {
    console.log("Changing port number!")
      const lastArgument = Deno.args[Deno.args.length - 1];
        port = Number(lastArgument);
    }
console.log(`Port number is: ${port}`)
app.listen({ port: port });

/*if(!Deno.env.get("TEST_ENVIRONMENT")){
    app.listen( { port: port});
}*/


export { app };