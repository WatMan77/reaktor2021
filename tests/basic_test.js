import { app } from "../app.js"
import { superoak, assertEquals, assertNotEquals } from "../deps.js"
import * as clothes from "../service/fetchingService.js"

//There isn't that much to test in the end. GET requests, failed fetch, making sure API calls work correctly
//and don't give corrupt data

Deno.test("GET request to all 3 main sites should be successful", async() => {
    const sites = ["gloves", "beanies", "masks"];
    for(let i = 0; i < 3; i++){
        const testClient = await superoak(app);
        await testClient.get(`/${sites[i]}`).expect(200);
    }
});

Deno.test("Gloves, beanies and masks should not be empty", async() => {
    let types = [clothes.getBeanies(), clothes.getMasks(), clothes.getGloves()]
    types.forEach(type => {
        //We check > 2 to make sure the response is not a string but holds real items.
        assertEquals(type.length > 2, true)
    })
});

Deno.test("Getting a failed fetch should correct itself", async() => {
    await clothes.updateItems(true);
    let types = [clothes.getBeanies(), clothes.getMasks(), clothes.getGloves()];
    types.forEach(type => {
        assertEquals(type.length > 2, true);
    })
});

Deno.test("After a failed fetch has been corrected, GET requests should work normally", async() => {
    const sites = ["gloves", "beanies", "masks"];
    for(let i = 0; i < 3; i++){
        const testClient = await superoak(app);
        await testClient.get(`/${sites[i]}`).expect(200);
    }
});

Deno.test("Removing one item from a manufacturer should result in at least one 'UNKNOWN AVAILABILITY'", async() => {
    
})