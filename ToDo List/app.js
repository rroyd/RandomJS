const form = document.querySelector("form");

const section = document.querySelector("section");

const input = document.querySelector("input");

let selectedToDo, editText, editDiv, toDoText, button;

const addToDo = function (toDo) {
  //createElements
  const div = document.createElement("div");
  const editDiv = document.createElement("div");
  const editText = document.createElement("input");
  const confirmButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const buttons = document.createElement("div");
  const p = document.createElement("p");
  const editButton = document.createElement("button");
  //Add classes & styles to divs
  editDiv.classList.add("edit-form");
  confirmButton.classList.add("confirm");
  buttons.classList.add("buttons");
  editText.setAttribute("placeholder", "Edit To do");
  editDiv.classList.add("hide");
  div.classList.add("toDo");
  deleteButton.classList.add("delete");
  editButton.classList.add("edit");
  p.classList.add("toDoText");
  //Add todo text to paragraph & icons
  p.innerText = toDo;
  confirmButton.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-check-lg"
    viewBox="0 0 16 16">
    <path
    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
    />`;
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>`;
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>`;
  //Append all elements to div
  buttons.append(editButton, deleteButton);
  editDiv.append(editText, confirmButton);
  div.append(editDiv, p);
  setTimeout(() => {
    div.append(buttons);
  }, 500);
  //Append todo to section
  section.append(div);
  setTimeout(() => div.classList.add("show"), 250);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value !== "") {
    addToDo(input.value);
  }
});
//Event delegation
section.addEventListener("click", (e) => {
  button = e.target;

  while (
    !button.classList.contains("delete") &&
    !button.classList.contains("edit") &&
    !button.classList.contains("confirm") &&
    button.tagName !== "BODY"
  ) {
    button = button.parentElement;
  }

  console.log(button);

  if (button.tagName !== "BODY") {
    selectedToDo = button.parentElement.parentElement;

    editText = selectedToDo.children[0].children[0];
    editDiv = selectedToDo.children[0];
    toDoText = selectedToDo.children[1];

    if (button.classList.contains("delete")) {
      selectedToDo.classList.remove("show");
      setTimeout(() => section.removeChild(selectedToDo), 500);
    } else if (button.classList.contains("edit")) {
      toDoText.classList.toggle("hide");
      editDiv.classList.toggle("hide");
      editText.value = toDoText.innerText;
    } else if (button.classList.contains("confirm")) {
      if (editText.value !== "") {
        toDoText.classList.toggle("hide");
        editDiv.classList.toggle("hide");
        toDoText.innerText = editText.value;
      }
    }
  }
});
