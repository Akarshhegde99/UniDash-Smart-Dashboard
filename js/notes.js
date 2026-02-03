import { Storage } from './storage.js';

export const NoteManager = {
    notes: [],

    init() {
        this.loadNotes();
        this.setupQuickNote();
        this.setupMainView();
    },

    loadNotes() {
        this.notes = Storage.getNotesList() || [];
    },

    saveNotes() {
        Storage.saveNotesList(this.notes);
    },

    setupQuickNote() {
        const quickNoteEl = document.getElementById('quick-note');
        if (!quickNoteEl) return;

        quickNoteEl.value = Storage.getQuickNote() || '';
        this.updateCharCount(quickNoteEl.value);

        quickNoteEl.addEventListener('input', (e) => {
            const content = e.target.value;
            this.updateCharCount(content);
            Storage.saveQuickNote(content);
        });

        document.getElementById('save-note')?.addEventListener('click', () => {
            Storage.saveQuickNote(quickNoteEl.value);
            alert('Quick note saved!');
        });
    },

    setupMainView() {
        const addBtn = document.getElementById('add-note-btn');
        const searchInput = document.getElementById('note-search');

        addBtn?.addEventListener('click', () => this.showNoteModal());
        searchInput?.addEventListener('input', (e) => this.renderNotes(e.target.value));

        this.renderNotes();
    },

    showNoteModal(noteId = null) {
        const modal = document.getElementById('modal-container');
        const modalBody = document.getElementById('modal-body');
        const note = noteId ? this.notes.find(n => n.id === noteId) : null;

        modalBody.innerHTML = `
            <div class="entry-form">
                <h2 style="margin-bottom: 1.5rem">${note ? 'Edit Note' : 'New Thought'}</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem">
                    <input type="text" id="note-title-input" placeholder="Title" value="${note ? note.title : ''}">
                    <textarea id="note-content-input" placeholder="Deep thoughts..." style="min-height: 200px">${note ? note.content : ''}</textarea>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem">
                        <button id="cancel-note" class="btn-secondary" style="flex: 1">Cancel</button>
                        <button id="submit-note" class="btn-primary" style="flex: 1">${note ? 'Update' : 'Capture'}</button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('cancel-note').onclick = () => modal.classList.add('hidden');
        document.getElementById('submit-note').onclick = () => {
            const title = document.getElementById('note-title-input').value;
            const content = document.getElementById('note-content-input').value;

            if (title && content) {
                if (noteId) {
                    const idx = this.notes.findIndex(n => n.id === noteId);
                    this.notes[idx] = { ...this.notes[idx], title, content, date: new Date().toISOString() };
                } else {
                    this.notes.unshift({
                        id: Date.now().toString(),
                        title,
                        content,
                        date: new Date().toISOString()
                    });
                }
                this.saveNotes();
                this.renderNotes();
                modal.classList.add('hidden');
            }
        };
    },

    renderNotes(filter = '') {
        const grid = document.getElementById('notes-grid');
        if (!grid) return;

        const filtered = this.notes.filter(n =>
            n.title.toLowerCase().includes(filter.toLowerCase()) ||
            n.content.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 3rem; color: var(--secondary)">No thoughts found in orbit.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(note => `
            <div class="card glass note-card" onclick="NoteManager.showNoteModal('${note.id}')">
                <div>
                    <h4>${note.title}</h4>
                    <p>${note.content}</p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--secondary)">
                    ${new Date(note.date).toLocaleDateString()}
                    <button onclick="event.stopPropagation(); NoteManager.deleteNote('${note.id}')" 
                            style="float: right; background: none; border: none; color: var(--danger); cursor: pointer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    deleteNote(id) {
        if (confirm('Erase this note from history?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.saveNotes();
            this.renderNotes();
        }
    },

    updateCharCount(text) {
        const countEl = document.getElementById('note-char-count');
        if (countEl) countEl.textContent = `${text.length} characters`;
    }
};

// Make accessible for inline onclick
window.NoteManager = NoteManager;
