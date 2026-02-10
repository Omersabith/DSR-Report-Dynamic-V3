// CONFIGURATION
const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

// --- INITIAL DATA STRUCTURE (Based on your Screenshots) ---
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

    // VIEW 3: KDR Channel Wise (9-Row Structure)
    view3: {
        title: "KDR Channel Wise Sales Analysis (v3.2 Expanded)",
        headers: ["Month", "Total", "Lulu", "Nesto", "Msouq", "Extra", "Hypermax", "Istyle", "Emax", "Others"],
        rows: [
            ["Aug-25", 182062, 101839, 41016, 39207, 0, 0, 0, 0, 0],
            ["Sep-25", 76067, 66236, 9831, 0, 0, 0, 0, 0, 0],
            ["Oct-25", 174236, 57725, 4336, 15814, 96361, 0, 0, 0, 0],
            ["Nov-25", 89885, 33503, 6240, 4568, 45574, 0, 0, 0, 0],
            ["Dec-25", 112130, 55185, 23327, 10383, 23235, 0, 0, 0, 0],
            ["Jan-26", 152093, 56128, 2800, -229, 12929, 32327, 14834, 25208, 8095],
            ["Feb-26", 42941, 30097, -2884, 0, 1543, -19, 4136, 10068, 0],
            ["-", "", "", "", "", "", "", "", "", ""] // Row 8: Placeholder to reach 9 total
        ],
        total: ["Grand total", 829412, 400712, 84665, 69743, 179641, 32308, 18970, 35276, 8095] // Row 9
    },

    // VIEW 4: Category Wise Sales
    view4: {
        title: "Sales Analysis Category Wise",
        headers: ["Month", "Charging", "Soundcore", "Eufy Appliances", "Eufy Security", "Sales Share"],
        rows: [
            { col1: "Jan-26", col2: 123615, col3: 113353, col4: 28748, col5: 17425, col6: "" },
            { col1: "Feb-26", col2: 25527, col3: 23930, col4: 5979, col5: 2077, col6: "" }
        ],
        total: { col1: "Grand total", col2: 693401, col3: 663591, col4: 186822, col5: 113636, col6: 0 }
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
        total: null // No total row for this one in screenshot
    }
};

// --- STATE MANAGEMENT ---
let db = JSON.parse(localStorage.getItem('salesDB_v3')) || defaultData;
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
    
    // Show/Hide Admin Button
    document.getElementById('admin-btn').style.display = isAdmin ? 'block' : 'none';
    
    // Load default view
    switchView();
}

function switchView() {
    const selector = document.getElementById('view-selector');
    const selectedKey = selector.value;
    const data = db[selectedKey];

    // Update Title
    document.getElementById('table-title').innerText = data.title;

    // Render Headers
    const thead = document.getElementById('table-head');
    thead.innerHTML = "";
    const trHead = document.createElement('tr');
    data.headers.forEach(h => {
        const th = document.createElement('th');
        th.innerText = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Render Body
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = "";

    // 1. Render Normal Rows
    data.rows.forEach(row => {
        const tr = document.createElement('tr');
        // Loop through col1, col2, etc...
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            // Format numbers (add commas, no decimals if integer)
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            
            // Highlight percentage cells logic (simple check)
            if(String(val).includes('%')) td.classList.add('highlight-cell');
            
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // 2. Render Grand Total Row (if exists)
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
    // Pre-fill textarea with current DB
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
        localStorage.setItem('salesDB_v3', JSON.stringify(db));
        closeAdminPanel();
        switchView(); // Refresh table
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
    
    // Header
    csv.push(data.headers.join(","));
    
    // Rows
    data.rows.forEach(row => {
        csv.push(Object.values(row).join(","));
    });

    // Total
    if(data.total) {
        csv.push(Object.values(data.total).join(","));
    }

    // Download Link
    const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvFile);
    link.download = `${data.title}.csv`;
    link.click();
}