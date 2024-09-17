class Stack {
    constructor() {
        this.stack = []
        this.length = 0
    }
    //methods
    sTop() {
        if (this.length == 0) {
            return null
        }
        return this.stack[this.length-1]
    }
    sPop() {
        if (this.length == 0) {
            return false
        }
        this.length--;
        return this.stack.pop()
    }
    sPush(value) {
        if (this.length > 10) {
            return false;
        }
        this.stack.push(value)
        this.length++;
        return this.length;
    }
}

const stack = new Stack();

const stackEl = document.querySelector(".stack")
const queueEl = document.querySelector(".queue")

const pushBtn = document.querySelector("#push")
const popBtn = document.querySelector("#pop")
const input = document.querySelector("#stackInput")

pushBtn.addEventListener('click', pushToStack)
popBtn.addEventListener('click', popToStack)


function pushToStack() {
    let value = input.value;
    input.value = "";
    let id = stack.sPush(value)
    if (!id)
        return;
    const newDiv = document.createElement("div");
    newDiv.textContent = value;
    newDiv.id = `stack.div.${id}`
    stackEl.append(newDiv);
}

function popToStack() {
    let value = stack.sPop()
    if (value == false) {
        return
    }
    const lastDiv = document.getElementById("stack.div." + (stack.length + 1))
    input.value = value
    lastDiv.remove()
}