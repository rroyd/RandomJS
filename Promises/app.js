const body = document.body;

const createPromiseColor = function(color) {
    return new Promise((resolve)=> {
        setTimeout(()=> {
            body.style.backgroundColor = color;
            resolve();
        }, 1000);
    })
}

createPromiseColor("red")
    .then(() => {
        return createPromiseColor("blue")
    })
    .then(() => {
        return createPromiseColor("green")
    })
    .then(() => {
        return createPromiseColor("yellow")
    })
    .then(() => {
        return createPromiseColor("purple")
    })
    .then(() => {
        return createPromiseColor("")
    })

async function rainbow() {
    await createPromiseColor("blue");
    await createPromiseColor("green");
    await createPromiseColor("yellow");
    await createPromiseColor("purple");
    await createPromiseColor("");
    return "Success!"
}