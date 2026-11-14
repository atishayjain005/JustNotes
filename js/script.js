'use strict';

const notesElm = document.getElementById('notes');
const addTxt = document.getElementById('addTxt');
const search = document.getElementById('searchTxt');
const status = document.createElement('p');
status.setAttribute('role', 'status');
notesElm.before(status);
const results = document.createElement('p');
results.setAttribute('role', 'status');
results.id = 'searchResults';
notesElm.before(results);
let notes = [];
let storageReadable = true;
let storageSnapshot;

try {
    storageSnapshot = localStorage.getItem('notes');
    const stored = JSON.parse(storageSnapshot || '[]');
    if (!Array.isArray(stored) || stored.some(note => typeof note !== 'string')) {
        throw new Error('Invalid saved notes');
    }
    notes = stored;
} catch {
    storageReadable = false;
    status.textContent = 'Saved notes could not be read. Your stored data has not been changed. Check browser storage access or recover the notes entry before reloading.';
}

function persist(next) {
    if (!storageReadable) return false;
    try {
        if (localStorage.getItem('notes') !== storageSnapshot) {
            status.textContent = 'Notes changed in another tab. Copy any unsaved text, then reload before saving. Nothing has been overwritten.';
            return false;
        }
        localStorage.setItem('notes', JSON.stringify(next));
        storageSnapshot = JSON.stringify(next);
        notes = next;
        return true;
    } catch {
        status.textContent = 'Could not save. Browser storage may be full or unavailable. Your input has been kept; try again after freeing space.';
        return false;
    }
}

function showNotes() {
    notesElm.replaceChildren();
    notes.forEach((text, index) => {
        const card = document.createElement('article');
        card.className = 'noteCard card m-2';
        card.style.width = '18rem';
        const body = document.createElement('div');
        body.className = 'card-body';
        const title = document.createElement('h3');
        title.textContent = 'Note ' + (index + 1);
        const content = document.createElement('p');
        content.className = 'card-text';
        content.textContent = text;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'btn btn-primary';
        remove.textContent = 'Delete Note';
        remove.setAttribute('aria-label', 'Delete note ' + (index + 1));
        remove.addEventListener('click', () => {
            if (notesElm.querySelector('textarea')) {
                status.textContent = 'Save or cancel your open edit before deleting a note.';
                return;
            }
            if (persist(notes.filter((_, position) => position !== index))) {
                showNotes();
                status.textContent = 'Note deleted.';
            }
        });
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'btn btn-secondary';
        edit.textContent = 'Edit Note';
        edit.setAttribute('aria-label', 'Edit note ' + (index + 1));
        edit.addEventListener('click', () => {
            const editor = document.createElement('textarea');
            editor.className = 'form-control';
            editor.value = notes[index];
            editor.setAttribute('aria-label', 'Edit text for note ' + (index + 1));
            const save = document.createElement('button');
            save.type = 'button';
            save.className = 'btn btn-primary';
            save.textContent = 'Save changes';
            const cancel = document.createElement('button');
            cancel.type = 'button';
            cancel.className = 'btn btn-secondary';
            cancel.textContent = 'Cancel';
            function restore() {
                editor.replaceWith(content);
                save.remove();
                cancel.remove();
                edit.hidden = false;
                remove.hidden = false;
                edit.focus();
            }
            save.addEventListener('click', () => {
                const value = editor.value.trim();
                if (!value) {
                    status.textContent = 'A note cannot be empty.';
                    editor.focus();
                    return;
                }
                if (persist(notes.map((note, position) => position === index ? value : note))) {
                    content.textContent = value;
                    restore();
                    status.textContent = 'Changes saved.';
                    filterNotes();
                }
            });
            cancel.addEventListener('click', restore);
            editor.addEventListener('keydown', event => {
                if (event.key === 'Escape') restore();
            });
            content.replaceWith(editor);
            edit.hidden = true;
            remove.hidden = true;
            body.append(save, cancel);
            editor.focus();
        });
        body.append(title, content, edit, remove);
        card.append(body);
        notesElm.append(card);
    });
    if (!notes.length) notesElm.textContent = 'No notes yet. Add your first note above.';
    filterNotes();
}

document.getElementById('addBtn').addEventListener('click', () => {
    if (notesElm.querySelector('textarea')) {
        status.textContent = 'Save or cancel your open edit before adding another note.';
        return;
    }
    const text = addTxt.value.trim();
    if (!text) {
        status.textContent = 'Write a note before adding it.';
        addTxt.focus();
        return;
    }
    if (persist([...notes, text])) {
        addTxt.value = '';
        showNotes();
        status.textContent = 'Note saved.';
        addTxt.focus();
    }
});
function filterNotes() {
    const query = search.value.trim().toLocaleLowerCase();
    let matches = 0;
    for (const card of notesElm.querySelectorAll('.noteCard')) {
        const text = card.querySelector('p')?.textContent ?? card.querySelector('textarea').value;
        card.hidden = !text.toLocaleLowerCase().includes(query);
        if (!card.hidden) matches++;
    }
    results.textContent = query
        ? matches + ' matching note' + (matches === 1 ? '' : 's') + (matches ? '.' : '. Try another search.')
        : '';
}
search.addEventListener('input', filterNotes);
search.closest('form').addEventListener('submit', event => {
    event.preventDefault();
    filterNotes();
});
showNotes();
