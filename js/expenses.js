import { Storage } from './storage.js';

export const ExpenseManager = {
    expenses: [],

    init() {
        this.expenses = Storage.getExpenses();
        this.renderExpenses();
        this.setupEventListeners();
    },

    addExpense(description, category, amount, type) {
        const parsedAmount = Math.abs(parseFloat(amount));
        if (isNaN(parsedAmount) || parsedAmount <= 0) return;

        const entry = {
            id: Date.now().toString(),
            description,
            category,
            amount: parsedAmount,
            type, // 'income' or 'expense'
            date: new Date().toISOString()
        };
        this.expenses.push(entry);
        this.save();
        this.renderExpenses();
    },

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.save();
        this.renderExpenses();
    },

    save() {
        Storage.saveExpenses(this.expenses);
        this.updateStats();
    },

    updateStats() {
        let income = 0;
        let expense = 0;

        this.expenses.forEach(e => {
            if (e.type === 'income') income += e.amount;
            else expense += e.amount;
        });

        const balance = income - expense;

        document.getElementById('total-income').textContent = `Rs. ${income.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `Rs. ${expense.toFixed(2)}`;
        document.getElementById('total-balance').textContent = `Rs. ${balance.toFixed(2)}`;

        const statEl = document.querySelector('#stat-expenses .stat-value');
        if (statEl) statEl.textContent = `Rs. ${expense.toFixed(0)}`;
    },

    renderExpenses() {
        const body = document.getElementById('expense-list-body');
        if (!body) return;

        body.innerHTML = this.expenses.map(e => `
            <tr>
                <td>${new Date(e.date).toLocaleDateString()}</td>
                <td>${this.escapeHTML(e.description)}</td>
                <td><span class="tag tag-${e.category.toLowerCase()}">${e.category}</span></td>
                <td class="${e.type}">${e.type === 'income' ? '+' : '-'}Rs. ${e.amount.toFixed(2)}</td>
                <td>
                    <button class="btn-icon delete-expense" data-id="${e.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        this.updateStats();
        this.setupItemEvents();
    },

    setupEventListeners() {
        document.getElementById('add-expense')?.addEventListener('click', () => {
            this.showEntryForm();
        });

        document.getElementById('export-csv')?.addEventListener('click', () => {
            this.exportToCSV();
        });
    },

    setupItemEvents() {
        document.querySelectorAll('.delete-expense').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.deleteExpense(id);
            });
        });
    },

    showEntryForm() {
        const modal = document.getElementById('modal-container');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <div class="entry-form">
                <h2 style="margin-bottom: 1.5rem">New Orbit Entry</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem">
                    <input type="text" id="exp-desc" placeholder="Description (e.g. Grocery)">
                    <input type="number" id="exp-amount" placeholder="Amount (in Rs.)">
                    <select id="exp-type">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input type="text" id="exp-cat" placeholder="Category (e.g. Food, Salary)">
                    <div style="display: flex; gap: 1rem; margin-top: 1rem">
                        <button id="cancel-exp" class="btn-secondary" style="flex: 1">Cancel</button>
                        <button id="submit-exp" class="btn-primary" style="flex: 1">Add Entry</button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('cancel-exp').onclick = () => modal.classList.add('hidden');
        document.getElementById('submit-exp').onclick = () => {
            const desc = document.getElementById('exp-desc').value;
            const amount = document.getElementById('exp-amount').value;
            const type = document.getElementById('exp-type').value;
            const cat = document.getElementById('exp-cat').value;

            if (desc && amount) {
                const numAmount = parseFloat(amount);
                if (numAmount <= 0) {
                    alert('Please enter a positive amount.');
                    return;
                }
                this.addExpense(desc, cat || 'General', numAmount, type);
                modal.classList.add('hidden');
            } else {
                alert('Please fill in all required fields.');
            }
        };
    },

    exportToCSV() {
        if (this.expenses.length === 0) {
            alert('No data to export!');
            return;
        }

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const rows = this.expenses.map(e => [
            new Date(e.date).toLocaleDateString(),
            e.description,
            e.category,
            e.type,
            e.amount
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "unidash_balance_sheet.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
};
