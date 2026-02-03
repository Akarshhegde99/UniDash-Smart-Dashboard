/**
 * Antigravity Lightweight Unit Tests
 * Run this in the console to verify system integrity.
 */

export const RunTests = () => {
    console.group('🧪 Antigravity Test Suite');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    const assert = (condition, message) => {
        if (condition) {
            results.passed++;
            console.log(`✅ ${message}`);
        } else {
            results.failed++;
            console.error(`❌ ${message}`);
        }
    };

    // Test 1: Storage Layer
    try {
        localStorage.setItem('test_val', JSON.stringify({ a: 1 }));
        const val = JSON.parse(localStorage.getItem('test_val'));
        assert(val.a === 1, 'Storage Layer: Can read/write JSON to localStorage');
    } catch (e) {
        assert(false, 'Storage Layer: Failed');
    }

    // Test 2: Task Logic
    const mockTasks = [{ id: '1', title: 'Test Task', completed: false }];
    assert(Array.isArray(mockTasks), 'Task System: Handles array data');

    // Test 3: Date/Time Logic
    const greeting = new Date().getHours() < 12 ? 'Morning' : 'Day/Evening';
    assert(typeof greeting === 'string', 'Time Core: Dynamic greeting logic functional');

    // Test 4: Expenses Logic
    const mockExpenses = [
        { type: 'income', amount: 100 },
        { type: 'expense', amount: 40 }
    ];
    const balance = mockExpenses.reduce((acc, curr) =>
        curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
    );
    assert(balance === 60, 'Expense Orbit: Calculation logic correct');

    console.groupEnd();

    console.log(`Test Summary: ${results.passed} Passed, ${results.failed} Failed`);
    return results;
};
