# 🗂️ QuickNote

QuickNote is a lightweight, easy-to-use note-taking web app. It allows users to quickly jot down ideas, sort by category/date/title, and edit or search notes directly in the browser. Built with JavaScript, HTML, and CSS, it also supports Chrome Extension deployment.

> ✍️ Built as a personal solution for quickly taking notes while watching online videos—no need to switch tabs or open another note-taking app.

## 📷 Screenshot

![Alt text](path/to/image.png)

## 🔗 Demo

[https://quicknote1.netlify.app](https://quicknote1.netlify.app)

> 🔔 **Note:** This demo link is for the web app version only. The Chrome Extension version must be installed manually via `chrome://extensions` using the `manifest.json` file.

---

## 🚀 Features

- 🆕 Add notes with `title`, `body`, `date`, and `category` (emoji)
- 📝 Edit existing notes in-place
- 🗑 Delete notes individually
- 💾 Save and persist notes using `localStorage`
- 🔎 Search notes by keyword (title, body, or category)
- 🔃 Sort notes by:

  - 📅 Date
  - 🔤 Title
  - 📂 Category

- 🧼 Clear all notes (with confirmation prompt)

---

## 🛠 Technologies Used

| Technology                    | Purpose                         |
| ----------------------------- | ------------------------------- |
| HTML5 + CSS3                  | Structure and styling           |
| JavaScript                    | Functionality and interactivity |
| `localStorage`                | Persistent data storage         |
| Chrome Extensions Manifest V3 | Packaging as an extension       |

---

## 🧩 Chrome Extension Setup

### Changes Made for Chrome Extension Compatibility

1. **Removed all inline JavaScript (e.g., `onClick="..."`)**
   → Replaced with `addEventListener()` and `data-*` attributes.

2. **All event listeners are defined inside `index.js`.**

   ```js
   const deleteBtns = document.querySelectorAll(".delete-btn");
   deleteBtns.forEach((btn) => {
     btn.addEventListener("click", () => {
       const index = btn.getAttribute("data-index");
       deleteNote(Number(index));
     });
   });
   ```

3. **Rebinds button events after DOM updates**
   → Event binding is called inside `renderNote1()` and `renderNote2()` to ensure newly created buttons respond to clicks.

4. **Clear All Button Update**

   - Replaces `dblclick` with a regular `click` + `confirm()` dialog for better browser support and UX:

   ```js
   clearAllBtn.addEventListener("click", function () {
     if (confirm("Are you sure you want to delete all notes?")) {
       allNotes = [];
       noteSections.innerHTML = "";
       localStorage.clear();
     }
   });
   ```

5. **`manifest.json` Configuration:**

```json
{
  "manifest_version": 3,
  "version": "1.0",
  "name": "QuickNote",
  "action": {
    "default_popup": "index.html",
    "default_icon": "logo.png"
  }
}
```

---

## 📝 How to Use

1. **Add a Note**

   - Fill in the title, body, and select a category
   - Click **Add**

2. **Edit a Note**

   - Click 📝 to edit
   - Click 💾 to save

3. **Delete a Note**

   - Click 🗑

4. **Sort Notes**

   - Use the dropdown to sort by 📅 Date, 🔤 Title, or 📂 Category

5. **Search Notes**

   - Type a keyword and click 🔍
   - Matching notes will appear

6. **Clear All Notes**

   - Click "Clear All Notes" and confirm the action

---

## 🔧 JavaScript Concepts

| Concept              | Used For                |
| -------------------- | ----------------------- |
| `forEach()`          | Loop through notes      |
| `localStorage`       | Persistent note storage |
| `addEventListener()` | Handling button actions |
| `data-*` attributes  | Tracking note indexes   |
| `RegExp`             | Flexible search         |
| `sort()`             | Sorting logic           |

---

## 🧠 Internal Notes

- `noteSections.innerHTML = ""`
  → Clears UI before rendering new notes to avoid duplicates.

- `uniqueDate = new Set()`
  → Ensures each date is displayed only once when grouping notes by date.

---

## 💡 Why I Made This App

While watching JavaScript tutorials online, I found it slow to switch to another tab with a note-taking app just to jot something down. So I built QuickNote—a compact tool that lets me write, search, and edit notes without leaving the browser. It later evolved into a Chrome Extension with sorting, filtering, and offline support.

---

## 🧭 Future Features

- 🌓 Dark mode toggle
- 🖇️ Tags or multi-category support
- 🔐 Password or pin-lock for privacy

---

## 🔐 Permissions & Storage

- Uses `localStorage` only—no cloud or server involved
- Works 100% offline
- Requires no special permissions from Chrome

---

Let me know if you'd like me to help generate a favicon, logo, or update the README in `.md` format too!
