const addBtn = document.getElementById("add-btn");
const titleEl = document.getElementById("title");
const memoText = document.getElementById("memo-text");
const categoryEl = document.getElementById("category");
const sortByEl = document.getElementById("sort-by");
const inputSearchEl = document.getElementById("input-search");

const noteSections = document.getElementById("note-section");

const deleteBtn = document.getElementById("delete-btn");
const clearAllBtn = document.getElementById("clearAll-btn");
const searchBtn = document.getElementById("search-btn");

let allNotes = [];
let uniqueDate = new Set();
const allNotesFromLocal = JSON.parse(localStorage.getItem("allNotes"));

// Load notes from localStorage on page load
if (allNotesFromLocal) {
  allNotes = allNotesFromLocal;
  renderNote1(allNotes);
}

// Get input values and return them as an object
function updateInputValue() {
  const title = titleEl.value;
  const noteBody = memoText.value;
  const category = categoryEl.value;
  const date = new Date().toLocaleDateString("en-CA");

  return { title, noteBody, category, date };
}

// Add new note
addBtn.addEventListener("click", function () {
  // updateInputValue() => object
  const note = updateInputValue();
  if (!(note.title && note.noteBody)) {
    alert("Please fill in title, note text.");
  } else {
    allNotes.push(note);
    localStorage.setItem("allNotes", JSON.stringify(allNotes));
    noteSections.innerHTML = "";
    uniqueDate = new Set(); // Reset for date grouping
    sortNotes();
    titleEl.value = "";
    memoText.value = "";
    categoryEl.value = "💼";
  }
});

// Sort notes based on selected option
sortByEl.addEventListener("change", sortNotes);

function sortNotes() {
  noteSections.innerHTML = "";
  uniqueDate = new Set();
  if (sortByEl.value === "date") {
    allNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderNote1(allNotes);
  } else if (sortByEl.value === "title") {
    allNotes.sort((a, b) => a.title.localeCompare(b.title));
    renderNote2(allNotes);
  } else if (sortByEl.value === "category") {
    allNotes.sort((a, b) => a.category.localeCompare(b.category));
    renderNote2(allNotes);
  } else {
    renderNote1(allNotes);
  }
  localStorage.setItem("allNotes", JSON.stringify(allNotes));
}

// Show date once per group
function countDate(date) {
  if (!uniqueDate.has(date)) {
    uniqueDate.add(date);
    return `<p class="date">${date}</p>`;
  } else {
    return "";
  }
}

// Render notes with date grouping
function renderNote1(allNotes) {
  allNotes.forEach(function (note, i) {
    noteSections.innerHTML += `
          <div class="show-notes">
          <div id="show-date-${i}" class="show-date">${countDate(
      note.date
    )}</div>
            <div class="show-note" id="show-note-${i}">
                <div>
                    <div class="show-title-section">
                      <input id="show-title-${i}" class="show-title" value="${
      note.title
    }" readonly/>
                      <p id="show-category">${note.category}</p>
                    </div>
                    <textarea id="show-text-${i}" class="show-text" readonly>${
      note.noteBody
    }</textarea>
                </div>
                <div class="btns">
                    <button class="edit-btn" data-index="${i}"><span id="state-${i}">📝</span></button>
                    <button class="delete-btn" data-index="${i}">🗑</button>
                </div>
            </div>
          </div>`;
  });
  addEventListenersToButtons();
}

// Render notes without grouping by date
function renderNote2(allNotes) {
  allNotes.forEach(function (note, i) {
    noteSections.innerHTML += `
          <div class="show-notes">
            <div class="show-note" id="show-note-${i}">
                <div>
                    <div class="show-title-section">
                    <p class="date">${note.date}</p>
                      <input id="show-title-${i}" class="show-title" value="${note.title}" readonly/>
                      <p id="show-category">${note.category}</p>
                    </div>
                    <textarea id="show-text-${i}" class="show-text" readonly>${note.noteBody}</textarea>
                </div>
                <div class="btns">
                    <button class="edit-btn" data-index="${i}"><span id="state-${i}">📝</span></button>
                    <button class="delete-btn" data-index="${i}">🗑</button>
                </div>
            </div>
          </div>`;
  });
  addEventListenersToButtons();
}

// Delete note by index and re-render
function deleteNote(i) {
  allNotes.splice(i, 1);
  localStorage.setItem("allNotes", JSON.stringify(allNotes));
  noteSections.innerHTML = "";
  uniqueDate = new Set();
  sortNotes();
}

// Toggle edit/save state for a note
function editNote(i) {
  const stateI = document.getElementById(`state-${i}`);
  const isStateEdit = stateI.innerText === "📝";
  stateI.innerText = isStateEdit ? "💾" : "📝";
  const showTextI = document.getElementById(`show-text-${i}`);
  const showTitleI = document.getElementById(`show-title-${i}`);

  if (stateI.innerText === "💾") {
    showTextI.removeAttribute("readonly");
    showTitleI.removeAttribute("readonly");
  } else {
    const updatedTitle = showTitleI.value;
    const updatedText = showTextI.value;
    allNotes[i].title = updatedTitle;
    allNotes[i].noteBody = updatedText;
    localStorage.setItem("allNotes", JSON.stringify(allNotes));
    showTextI.setAttribute("readonly", "");
    showTitleI.setAttribute("readonly", "");
  }
}

function addEventListenersToButtons() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = btn.getAttribute("data-index");
      deleteNote(Number(index));
    });
  });

  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = btn.getAttribute("data-index");
      editNote(Number(index));
    });
  });
}

// Clear all notes from UI and localStorage
document.addEventListener("DOMContentLoaded", function () {
  clearAllBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all notes?")) {
      allNotes = [];
      noteSections.innerHTML = "";
      localStorage.clear();
    }
  });
});

// Filter and render notes matching the search keyword
searchBtn.addEventListener("click", findMatchNote);

function findMatchNote() {
  const keyword = inputSearchEl.value.trim();
  const regexp = new RegExp(keyword, "ig");
  const matchedNote = allNotes.filter((note) =>
    regexp.test(`${note.title} ${note.noteBody} ${note.category} `)
  );
  noteSections.innerHTML = "";
  uniqueDate = new Set();
  renderNote1(matchedNote);
  addEventListenersToButtons();
}
