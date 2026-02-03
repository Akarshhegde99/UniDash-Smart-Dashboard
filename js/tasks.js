import { Storage } from './storage.js';

export const TaskManager = {
    tasks: [],

    init() {
        this.tasks = Storage.getTasks();
        this.renderTasks();
        this.setupEventListeners();
    },

    addTask(title) {
        if (!title.trim()) return;
        const newTask = {
            id: Date.now().toString(),
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        this.save();
        this.renderTasks();
    },

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.save();
        this.renderTasks();
    },

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
        this.renderTasks();
    },

    save() {
        Storage.saveTasks(this.tasks);
        this.updateStats();
    },

    updateStats() {
        const pending = this.tasks.filter(t => !t.completed).length;
        const statEl = document.querySelector('#stat-tasks .stat-value');
        if (statEl) statEl.textContent = pending;
    },

    renderTasks(searchQuery = '', filter = 'all') {
        const fullList = document.getElementById('full-task-list');
        const miniList = document.getElementById('mini-task-list');

        if (!fullList || !miniList) return;

        let filteredTasks = [...this.tasks];

        // Apply Search
        if (searchQuery) {
            filteredTasks = filteredTasks.filter(t =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply Filter
        if (filter === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        } else if (filter === 'pending') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        }

        const taskHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" draggable="true">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-toggle">
                <div class="task-content">${this.escapeHTML(task.title)}</div>
                <div class="task-actions">
                    <button class="btn-icon delete-task"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        fullList.innerHTML = taskHTML || '<p class="empty-msg">No tasks found.</p>';

        // Mini list for dashboard (show only top 5)
        const miniHTML = this.tasks.slice(0, 5).map(task => `
            <div class="task-item-mini">
                <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                <span>${this.escapeHTML(task.title)}</span>
            </div>
        `).join('');

        miniList.innerHTML = miniHTML || '<p class="empty-msg">Clear skies.</p>';

        this.updateStats();
        this.setupItemEvents();
    },

    setupEventListeners() {
        document.getElementById('add-task-full')?.addEventListener('click', () => {
            this.showTaskModal();
        });

        document.querySelector('.add-task-btn')?.addEventListener('click', () => {
            this.showTaskModal();
        });

        // Search and Filter
        document.getElementById('task-search')?.addEventListener('input', (e) => {
            this.renderTasks(e.target.value, document.getElementById('task-filter').value);
        });

        document.getElementById('task-filter')?.addEventListener('change', (e) => {
            this.renderTasks(document.getElementById('task-search').value, e.target.value);
        });
    },

    showTaskModal() {
        const modal = document.getElementById('modal-container');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <div class="entry-form">
                <h2 style="margin-bottom: 1.5rem">Add New Task</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem">
                    <input type="text" id="task-title-input" placeholder="What needs to be done?">
                    <div style="display: flex; gap: 1rem; margin-top: 1rem">
                        <button id="cancel-task" class="btn-secondary" style="flex: 1">Cancel</button>
                        <button id="submit-task" class="btn-primary" style="flex: 1">Create Task</button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('cancel-task').onclick = () => modal.classList.add('hidden');
        document.getElementById('submit-task').onclick = () => {
            const title = document.getElementById('task-title-input').value;
            if (title) {
                this.addTask(title);
                modal.classList.add('hidden');
            }
        };
    },

    setupItemEvents() {
        document.querySelectorAll('.task-toggle').forEach(el => {
            el.addEventListener('change', (e) => {
                const id = e.target.closest('.task-item').dataset.id;
                this.toggleTask(id);
            });
        });

        document.querySelectorAll('.delete-task').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.target.closest('.task-item').dataset.id;
                this.deleteTask(id);
            });
        });

        // Simple Drag and Drop implementation
        const draggables = document.querySelectorAll('.task-item');
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                this.updateOrder();
            });
        });

        const container = document.getElementById('full-task-list');
        container?.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    },

    updateOrder() {
        const items = [...document.querySelectorAll('.task-item')];
        const newOrder = items.map(item => {
            return this.tasks.find(t => t.id === item.dataset.id);
        });
        this.tasks = newOrder;
        this.save();
    },

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
};
