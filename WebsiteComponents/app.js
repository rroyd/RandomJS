const imageCarousel = document.getElementsByClassName("image-carousel")

const leftButton = document.getElementsByClassName("left")[0],
rightButton = document.getElementsByClassName("right")[0],
allImages = document.getElementsByClassName("images")[0];

let currentImage = document.getElementsByClassName("selected")[0],
images = document.querySelector(".images");
let selectedCircle = document.querySelector("#circle")

images.style.height = `${currentImage.height}px`;

leftButton.addEventListener('click',() => {
    if(currentImage.previousElementSibling !== null) {
        currentImage.previousElementSibling.classList.add("selected")

        currentImage.classList.remove("selected");
        currentImage.classList.add("to-the-right");

        if (currentImage.nextElementSibling) {
            currentImage.nextElementSibling.classList.add("hide-to-right")
        }

        currentImage = currentImage.previousElementSibling;

        if(currentImage.previousElementSibling) {
            currentImage.previousElementSibling.classList.remove("hide-to-left")
        }
        if(selectedCircle.previousElementSibling) {
            selectedCircle.id = ""
            selectedCircle = selectedCircle.previousElementSibling;
            selectedCircle.id = "circle";
        }

        setTimeout(() => {
            currentImage.classList.remove("to-the-left");
        },250)
    }
    images.style.height = `${currentImage.height}px`;
})


rightButton.addEventListener('click',() => {
    if (currentImage.nextElementSibling.classList.contains("to-the-right")) {
        currentImage.nextElementSibling.classList.add("selected")

        currentImage.classList.remove("selected");
        currentImage.classList.add("to-the-left");


        if (currentImage.previousElementSibling) {
            currentImage.previousElementSibling.classList.add("hide-to-left");
        }

        if(selectedCircle.nextElementSibling) {
            selectedCircle.id = ""
            selectedCircle = selectedCircle.nextElementSibling;
            selectedCircle.id = "circle";
        }

        currentImage = currentImage.nextElementSibling;

        if(currentImage.nextElementSibling) {
            currentImage.nextElementSibling.classList.remove("hide-to-right")
        }

        setTimeout(() => {
            currentImage.classList.remove("to-the-right");
        },250)
    }

    images.style.height = `${currentImage.height}px`;
})

const arrow = document.querySelector(".arrow");
const services = document.querySelector(".first-link")
const collapse = document.querySelector(".collapse")
let collapsed = true;
collapse.style.display = "none"


services.addEventListener("click", (e) => {
    e.preventDefault();
    collapse.classList.toggle("show-links");
    arrow.classList.toggle("arrow-open");
    (collapsed) && (collapse.style.display = "grid");

    setTimeout(() => {
        (!collapsed) && (collapse.style.display = "none");
        collapsed = !collapsed;
    }, 250)
})

const observer = new IntersectionObserver((entries) => 
    entries.forEach(entry => {
        if(entry.isIntersecting && !(entry.target.classList.contains("collapse"))) {
            entry.target.classList.add("show");
        }
        else entry.target.classList.remove("show");
}), {threshold: 0.5});



const allDivs = document.querySelectorAll("div");
const inputs = document.querySelectorAll("input");

allDivs.forEach((div)=> observer.observe(div))

inputs.forEach((input)=> {
    input.addEventListener("input", () => {
        input.setAttribute("value", input.value);
    })
})

const validate = function(input) {
    let value = input.value;
    switch (input.name) {
        case "first": 
            return value.length > 0;
        case "last": 
            return value.length > 0;
        case "email": 
            let re = /\w+@\w+(.com|.net)/
            return value.length > 0 && re.test(value);
        case "birth": 
            let [year,month,day] = value.split("-").map((n)=>parseInt(n));
            const date = new Date()
            let dayNow = date.getUTCDate(), yearNow = date.getUTCFullYear(), monthNow = date.getUTCMonth() + 1
            let age = yearNow - year;
            if (monthNow > month) {
                age++
            }
            else if(monthNow === month) {
                if (dayNow>=day) {
                    age++
                }
            }
            return age >= 18;
        case "password":
            return /(\w{6,}\d{2,})|(\w{6,}\d{2,})/.test(value) && /!|@|#|$|%|^|&|(|)|_|#/.test(value);
        case "confirmPassword":
            let password = document.getElementsByName("password")[0];
            return password.value === value && !password.classList.contains("wrong");
    }
        
}

const formChecker = new MutationObserver((entries) => {
    const changedInput = entries[0].target;
    if(validate(changedInput)) {
        changedInput.classList.remove("wrong");
        changedInput.classList.add("true");
    } else {
        changedInput.classList.remove("true");
        changedInput.classList.add("wrong");
    }  
})

inputs.forEach((input) => {
    formChecker.observe(input, {
        attributes: true,
        attributeFilter: ["value"]
   })
})

const all = document.querySelector(".allElements");
const modalButton = document.querySelector(".modal-button")

const modal = document.createElement("div");
const sectionModal = document.createElement("section");
const modalTitle = document.createElement("h1");
const modalText = document.createElement("p");
const show = document.createElement("div");
const ok = document.createElement("button");

modal.id = "modal";
show.classList.add("show");
ok.classList.add("ok");
sectionModal.classList.add("modalSection");

show.append(ok);
sectionModal.append(modalTitle, modalText, show);
modal.append(sectionModal);

modalTitle.innerText = "lorem impsum"
modalText.innerText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, tempore aliquid minus assumenda error, iusto eligendi a quas eos amet quae recusandae nobis accusamus? Perspiciatis ipsum natus quod sed animi."
ok.innerText = "Ok"

let id;

modalButton.addEventListener("click", () => {
    all.classList.add("black");
    all.style.opacity = "1"
    
    for(let el of all.children)
        el.classList.add("black");

    all.insertAdjacentElement("afterend", modal);
    all.focus({preventScroll: true});
});

ok.addEventListener("click", () => {
    all.classList.remove("black");
    all.style.opacity = ""
    
    for(let el of all.children)
        el.classList.remove("black");

    modal.remove();
    
});

const accordion = document.querySelector(".accordion")

accordion.addEventListener("click", (e) => {
    if(e.target.tagName === "svg") {
        let p = e.target.parentElement.parentElement.children[2];

        (p.id === "") ? p.id = "reveal" :  p.id = "";
    }
})

const allCards = document.querySelectorAll(".cell");
const grid = document.querySelector(".grid");


let lastCard = document.querySelector(".cell:last-child");
let newCell;

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.id = "showCell";
            if (lastCard === entry.target) {
                console.log("REACHED LAST CARD")
                for (let i = 0; i < 10; i++) {
                    newCell = document.createElement("div")
                    newCell.classList.add("cell")
                    grid.append(newCell);

                    observer2.observe(newCell);
                }
                newCell.innerText = "Last card";

                lastCard = document.querySelector(".cell:last-child");
            } 
        }
    })
}, {threshold: 0.5})

allCards.forEach((card) => observer2.observe(card));