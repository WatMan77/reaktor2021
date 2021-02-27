let gloves, beanies, masks;
let manufacturers = new Map(); //Hold info about manufacturers and item availability

//Helper function to deal with errors. Also helps the tests a bit
const errorChecking = async(data, names) => {
    while(data.filter(x => !x || typeof(x.response) === "string").length != 0){
        let promises = [];
        let indexes = []
        for(let i = 0; i < data.length; i++){
            if(!data[i] || typeof(data[i].response) === "string"){
                promises.push(fetch(`http://bad-api-assignment.reaktor.com/v2/availability/${names[i]}`)
                .then(response => {
                    return response.json();
                }))
                indexes.push(i);
            }
        }
        //List does not necessarily have indexes in the same order as data!!!
        const list = await Promise.all(promises);
        for(let k = 0; k < list.length; k++){
            const index = indexes[k];
            data[index] = list[k];
        }
    }
}

const updateMans = async(fail) => {
    manufacturers = new Map(); //Erase previous manufacturers
    let items = [gloves, beanies, masks];
    let names = [];
    for(let i = 0; i < items.length; i++){
        for(let j = 0; j < items[i].length; j++){
            const man = items[i][j].manufacturer;
            if(!names.includes(man)){
                names.push(man);
            }
        }
    }
    //Promise returns an array of objects. During a test environment fetching will fail.
    let data;
    if(fail){
        console.log("Failing fetch on purpose")
            data = await Promise.all(
                names.map(n => 
                    fetch(`http://bad-api-assignment.reaktor.com/v2/availability/${n}`, {
                        headers: {
                            "x-force-error-mode": "all",
                        }
                    })
                    .then(response => {
                        return response.json();
                    })
                    )
            )
        } else {
            data = await Promise.all(
                names.map(n => 
                    fetch(`http://bad-api-assignment.reaktor.com/v2/availability/${n}`)
                    .then(response => {
                        return response.json();
                    })
                    )
            )
        }

    //If the type of the array (.response) is a string or object is undefined, that means an error occured and a new fetch must be made.
    await errorChecking(data, names);
    console.log("Errors should now be resolved")
    
    for(var i = 0; i < names.length; i++){
        manufacturers.set(names[i], data[i]);
    }

    //As the final step, we match the availability status of each item by
    //looking up the manufacturer and finding the item with the corresponding ID.
    items.forEach((type) => {
        type.forEach((item) => {
            const found = manufacturers.get(item.manufacturer).response.find(x => x.id.toLowerCase() === item.id);
            if(!found){ //Unlikely to happen but here as a safe measurement
                item.available = "AVAILABILITY UNKNOWN"
            } else {
                item.available = found
                .DATAPAYLOAD.match(new RegExp("(?<=<INSTOCKVALUE>)(.*)(?=<\/INSTOCKVALUE>)"))[0]
            }
        });
    });
   
}

//The final function which updates the items, availability etc by making new API calls.
const updateItems = async(fail) => {
    let items = ["gloves", "beanies", "facemasks"];
    [gloves, beanies, masks] = await Promise.all(
        items.map(end =>
                fetch(`https://bad-api-assignment.reaktor.com/v2/products/${end}`)
                .then(response => response.json()))
                )

    await updateMans(fail);
}

//The updateItems won't be called in the very beginning of the setInterval so we have to call it separately before.
//We update the items of the shop every hour as they (seem to at least) change after some amount of time.
//As the fecthing is a bit slow, once every hour should be fine.
await updateItems(false)
setInterval( async() => await updateItems(false), 1000*60*60);

//Getters for items
const getGloves = () => gloves;
const getBeanies = () => beanies;
const getMasks = () => masks;

export { updateItems, getGloves, getBeanies, getMasks }