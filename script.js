// CONFIGURATION
const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

// --- INITIAL DATA STRUCTURE ---
const defaultData = {
    // VIEW 1: Active Period Analysis
    view1: {
        title: "February Performance: Active Period Analysis",
        headers: ["Category", "Total Sale", "Sales Volume (IR)", "Sales Volume (KDR)", "Sale Share"],
        rows: [
            { col1: "CHARGING", col2: 20493, col3: 985, col4: 19508, col5: "13%" },
            { col1: "SOUNDCORE", col2: 18557, col3: 864, col4: 17693, col5: "11%" },
            { col1: "EUFY APPLIANCES", col2: 5980, col3: 5200, col4: 779, col5: "69%" },
            { col1: "EUFY SECURITY", col2: 1499, col3: 532, col4: 967, col5: "7%" }
        ],
        total: { col1: "Grand total", col2: 46528, col3: 7581, col4: 38947, col5: "" }
    },

    // VIEW 2: Monthly Analysis
    view2: {
        title: "Monthly Analysis and Summary Report",
        headers: ["Month", "Total Sale", "Sales Volume (IR)", "Sales Volume (KDR)", "Others"],
        rows: [
            { col1: "Aug-25", col2: 341461, col3: 159399, col4: 182062, col5: "" },
            { col1: "Sep-25", col2: 192248, col3: 116182, col4: 76067, col5: "" },
            { col1: "Oct-25", col2: 277102, col3: 102866, col4: 174236, col5: "" },
            { col1: "Nov-25", col2: 241532, col3: 109330, col4: 89885, col5: 42318 },
            { col1: "Dec-25", col2: 264453, col3: 125783, col4: 112130, col5: 26540 },
            { col1: "Jan-26", col2: 283140, col3: 131047, col4: 152093, col5: "" },
            { col1: "Feb-26", col2: 57513, col3: 15138, col4: 42375, col5: "" }
        ],
        total: { col1: "Grand total", col2: 1657449, col3: 759745, col4: 828846, col5: 68858 }
    },

    // VIEW 3: KDR Channel Wise (Fixed to Object Structure)
    view3: {
        title: "KDR Channel Wise Sales Analysis",
        headers: ["Month", "Total", "Lulu", "Nesto", "Msouq", "Extra", "Hypermax", "Istyle", "Emax", "Others"],
        rows: [
            { col1: "Aug-25", col2: 182062, col3: 101839, col4: 41016, col5: 39207, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0 },
            { col1: "Sep-25", col2: 76067, col3: 66236, col4: 9831, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0 },
            { col1: "Oct-25", col2: 174236, col3: 57725, col4: 4336, col5: 15814, col6: 96361, col7: 0, col8: 0, col9: 0, col10: 0 },
            { col1: "Nov-25", col2: 89885, col3: 33503, col4: 6240, col5: 4568, col6: 45574, col7: 0, col8: 0, col9: 0, col10: 0 },
            { col1: "Dec-25", col2: 112130, col3: 55185, col4: 23327, col5: 10383, col6: 23235, col7: 0, col8: 0, col9: 0, col10: 0 },
            { col1: "Jan-26", col2: 152093, col3: 56128, col4: 2800, col5: -229, col6: 12929, col7: 32327, col8: 14834, col9: 25208, col10: 8095 },
            { col1: "Feb-26", col2: 42941, col3: 30097, col4: -2884, col5: 0, col6: 1543, col7: -19, col8: 4136, col9: 10068, col10: 0 },
            { col1: "-", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "", col8: "", col9: "", col10: "" }
        ],
        total: { col1: "Grand total", col2: 829412, col3: 400712, col4: 84665, col5: 69743, col6: 179641, col7: 32308, col8: 18970, col9: 35276, col10: 8095 }
    },

    // VIEW 4: Sales Analysis Category Wise (Full Historical Data)
    view4: {
        title: "Sales Analysis Category Wise",
        headers: ["Month", "Charging", "Soundcore", "Eufy Appliances", "Eufy Security", "Sales Share"],
        rows: [
            { col1: "Aug-25", col2: 142517, col3: 153450, col4: 21345, col5: 24149, col6: "" },
            { col1: "Sep-25", col2: 98463, col3: 63187, col4: 18780, col5: 11817, col6: "" },
            { col1: "Oct-25", col2: 87097, col3: 130781, col4: 37778, col5: 21446, col6: "" },
            { col1: "Nov-25", col2: 103614, col3: 69448, col4: 46463, col5: 22007, col6: "" },
            { col1: "Dec-25", col2: 112568, col3: 109442, col4: 27729, col5: 14714, col6: "" },
            { col1: "Jan-26", col2: 123615, col3: 113353, col4: 28748, col5: 17425, col6: "" },
            { col1: "Feb-26", col2: 30733, col3: 25096, col4: 5979, col5: 2086, col6: "" },
            { col1: "-", col2: "", col3: "", col4: "", col5: "", col6: "" }
        ],
        total: { col1: "Grand total", col2: 698607, col3: 664757, col4: 186822, col5: 113645, col6: "" }
    },

    // VIEW 5: Individual Per Day
    view5: {
        title: "Individual Per Day Sales",
        headers: ["Sales Executive", "Target", "Today Sale", "Return", "MTD", "Achieved %", "Req Avg", "Trg Avg"],
        rows: [
            { col1: "ANAS", col2: 30000, col3: 0, col4: 0, col5: 13.6, col6: "0.05%", col7: 1499.32, col8: 1200 },
            { col1: "SUHAIL", col2: 25000, col3: 99.2, col4: 0, col5: 434, col6: "1.74%", col7: 1228.30, col8: 1000 },
            { col1: "SALAM", col2: 25000, col3: 0, col4: 0, col5: 377.9, col6: "1.51%", col7: 1231.11, col8: 1000 },
            { col1: "MANSEER", col2: 80000, col3: 1338, col4: 0, col5: 6755.8, col6: "8.44%", col7: 3662.21, col8: 3200 }
        ],
        total: null
    }
};

// --- STATE MANAGEMENT ---
// Updated to v6 to ensure new data structure loads
let db = JSON.parse(localStorage.getItem('salesDB_v6')) || defaultData;
let isAdmin = false;

// --- AUTHENTICATION ---
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(u === ADMIN_USER && p === ADMIN_PASS) {
        isAdmin = true;
        loadDashboard();
    } else {
        document.getElementById('login-error').innerText = "Invalid Login";
    }
}

function handleLogout() {
    isAdmin = false;
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
}

// --- CORE FUNCTIONS ---
function loadDashboard() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    document.getElementById('admin-btn').style.display = isAdmin ? 'block' : 'none';
    switchView();
}

function switchView() {
    const selector = document.getElementById('view-selector');
    const selectedKey = selector.value;
    const data = db[selectedKey];

    document.getElementById('table-title').innerText = data.title;

    const thead = document.getElementById('table-head');
    thead.innerHTML = "";
    const trHead = document.createElement('tr');
    data.headers.forEach(h => {
        const th = document.createElement('th');
        th.innerText = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = "";

    data.rows.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            if(String(val).includes('%')) td.classList.add('highlight-cell');
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    if (data.total) {
        const trTotal = document.createElement('tr');
        trTotal.classList.add('total-row');
        Object.values(data.total).forEach(val => {
            const td = document.createElement('td');
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            trTotal.appendChild(td);
        });
        tbody.appendChild(trTotal);
    }
}

// --- ADMIN DATA EDITING (JSON MODE) ---
function openAdminPanel() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('json-input').value = JSON.stringify(db, null, 4);
}

function closeAdminPanel() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function saveJsonData() {
    try {
        const input = document.getElementById('json-input').value;
        const newDB = JSON.parse(input);
        db = newDB;
        localStorage.setItem('salesDB_v6', JSON.stringify(db));
        closeAdminPanel();
        switchView();
        alert("Data updated successfully!");
    } catch (e) {
        alert("Invalid JSON format. Please check your syntax.");
    }
}

// --- EXPORT TO CSV ---
function exportTableToCSV() {
    const selector = document.getElementById('view-selector');
    const data = db[selector.value];
    let csv = [];
    csv.push(data.headers.join(","));
    data.rows.forEach(row => {
        csv.push(Object.values(row).join(","));
    });
    if(data.total) {
        csv.push(Object.values(data.total).join(","));
    }
    const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvFile);
    link.download = `${data.title}.csv`;
    link.click();
}