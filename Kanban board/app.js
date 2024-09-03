const note = document.querySelector(".note");

const body = document.querySelector("body");

const sections = document.querySelectorAll("section")

let title = document.querySelector(".content h3"),
desc = document.querySelector(".content blockquote");

let currTitle = title.innerText, 
currDesc = desc.innerText;

const isAdded = [false,false,false,false];

const createNewNote = function(title, desc) {
    const item = document.createElement("div");
    const newNote = document.createElement("div");
    const content = document.createElement("div");
    const h3 = document.createElement("h3");
    const blockqoute = document.createElement("blockqoute");

    newNote.draggable = "true";
    item.classList.add("item");
    newNote.classList.add("note");
    content.classList.add("content");

    h3.innerText = title;
    blockqoute.innerText = desc;

    content.append(h3,blockqoute)
    newNote.append(content);
    item.append(newNote);

    return item;
}

title.addEventListener('change', () => {
    console.log("hey")
})

body.addEventListener("dragover", (e) => {
    note.classList.add("dragging")
    note.style.top = `${e.clientY}px`;
    note.style.left = `${e.clientX}px`;
})

note.addEventListener('dragend', (e) => {
    e.preventDefault();
    note.classList.remove("dragging");
})

sections.forEach((section, i) => {
    //LEAVE SECTION
    let items = section.children[1];
    let currTitle = document.querySelector(".note .content h3").innerText,
    currDesc = document.querySelector(".note .content blockquote").innerText;
    let newNote = createNewNote(currTitle,currDesc)
    section.addEventListener("dragenter", (e) => {


        isAdded[i] === false && (items.append())
        isAdded[i] = true;
    })

    section.addEventListener("dragleave", (e) => {
        console.log(section)
        let lastItem = section.children[1].children[length]

    })
})