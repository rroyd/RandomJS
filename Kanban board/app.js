const note = document.querySelector(".note");

const body = document.querySelector("body");

const sections = document.querySelectorAll("section")

let newNote, draggedNote;

const booleans = [false,false,false,false];

let title = document.querySelector(".content h3"),
desc = document.querySelector(".content blockquote");

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
    item.id = "new";

    item.addEventListener("dragstart", ()=> {
        draggedNote = item;
    }) 

    return item;
}

note.addEventListener('dragstart',() => {
    newNote = createNewNote(title.innerText,desc.innerText);
    draggedNote = newNote;
})

body.addEventListener("drop", (e) => {
    if(e.target.tagName !== "SECTION") {
        newNote.remove();
    }
    else {
        let section = e.target, items = e.target.children[1];
        e.preventDefault();
        if(draggedNote.id === "new")
        {
            items.append(newNote);
            section.style.backgroundColor = "";

            newNote.classList.remove("hide");
            newNote.classList.remove("dragging");
            newNote.removeAttribute("style");
            newNote.id = "";

            title.innerText = "Enter title";
            desc.innerText = "Enter description";
        }
        else {
            section.append(draggedNote);
            section.style.backgroundColor = "";
        }

    }
});

sections.forEach((section, i) => {
    //LEAVE SECTION
    let items = section.children[1];

    currTitle = document.querySelector(".note .content h3").innerText,
    currDesc = document.querySelector(".note .content blockquote").innerText;
    section.addEventListener("dragenter", (e) => {
        if(!booleans[i])
        {
            section.style.backgroundColor = "grey";
            booleans[i] = true;
        }
    })

    section.addEventListener("dragleave", (e) => {
        if(booleans[i]) {
            section.style.backgroundColor = "";
            booleans[i] = false;
        }
    })

    section.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
})