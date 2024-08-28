//function to generate random color
const pickRandomColor = function() {
    return `rgb(${Math.floor(Math.random()*255)},
     ${Math.floor(Math.random()*255)},
    ${Math.floor(Math.random()*255)})`;
}
//selectors for the events
const button = document.querySelector("button");
const body = document.body;
const h1 = document.querySelector("h1");
//event listeners
button.addEventListener("click", () => {
    body.style.backgroundColor = pickRandomColor();
    h1.innerText = body.style.backgroundColor;
    
})
