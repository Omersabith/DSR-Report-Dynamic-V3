// --- CONFIGURATION ---
const SUPABASE_URL = 'https://iyxpvbvpampykfjffgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

let db = {};
let isAdmin = false;

// --- LOGIN ---
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        isAdmin = true;
        loadDashboard();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// --- CORE DASHBOARD ---
function loadDashboard() {
    // 1. Hide Login
    document.getElementById('login-container').classList.add('hidden');
    // 2. Show Dashboard
    document.getElementById('dashboard-container').classList.remove('hidden');
    
    // 3. CRITICAL FIX: Reset body layout from Flex (Center) to Block (Full Page)
    document.body.style.display = 'block';
    document.body.style.backgroundColor = 'white';

    // 4. Show Admin Button if logged in
    if (isAdmin) document.getElementById('admin-btn').classList.remove('hidden');

    // 5. Load Data
    fetchData();
}

async function fetchData() {
    console.log("Fetching...");
    const { data, error } = await supabaseClient
        .from('sales_data')
        .select('content')
        .eq('id', 1)
        .single();

    if (data) {
        db = data.content;
        renderTable();
    } else {
        console.error(error);
    }
}

function renderTable() {
    const viewKey = document.getElementById('view-selector').value;
    const data = db[viewKey];
    if (!data) return;

    document.getElementById('table-title').innerText = data.title;

    // Headers
    const thead = document.getElementById('table-head');
    thead.innerHTML = "<tr>" + data.headers.map(h => `<th>${h}</th>`).join('') + "</tr>";

    // Rows
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = "";
    data.rows.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.innerText = val.toLocaleString();
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // Total
    if (data.total) {
        const tr = document.createElement('tr');
        tr.style.fontWeight = 'bold';
        tr.style.background = '#f1f5f9';
        Object.values(data.total).forEach(val => {
            const td = document.createElement('td');
            td.innerText = val.toLocaleString();
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

// --- EXPORT TOOLS ---
function printReport() { window.print(); }

function exportTableToCSV() {
    const viewKey = document.getElementById('view-selector').value;
    const data = db[viewKey];
    let csv = data.headers.join(",") + "\n";
    data.rows.forEach(row => {
        csv += Object.values(row).join(",") + "\n";
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewKey}_report.csv`;
    a.click();
}

// --- ADMIN ---
function openAdminPanel() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('json-input').value = JSON.stringify(db, null, 4);
}
function closeAdminPanel() { document.getElementById('admin-modal').classList.add('hidden'); }

async function saveJsonData() {
    try {
        const newContent = JSON.parse(document.getElementById('json-input').value);
        await supabaseClient.from('sales_data').update({ content: newContent }).eq('id', 1);
        alert("Saved!");
        closeAdminPanel();
        fetchData();
    } catch(e) { alert("Error: " + e.message); }
}

document.getElementById('view-selector').addEventListener('change', renderTable);