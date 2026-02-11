// --- CONFIGURATION ---
// I have pre-filled your exact URL and Key here
const SUPABASE_URL = 'https://iyxpvbvpampykfjffgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

let db = {};
let isAdmin = false;

// --- LOGIN LOGIC ---
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        isAdmin = true;
        loadDashboard();
    } else {
        const err = document.getElementById('login-error');
        err.style.display = 'block';
        err.innerText = "Wrong password. Try again.";
    }
}

// --- CORE DASHBOARD LOGIC ---
function loadDashboard() {
    // Hide Login, Show Dashboard
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    
    // Allow CSS to switch from "Center Flex" to "Block" for the dashboard
    document.body.style.display = 'block'; 
    document.body.style.backgroundColor = 'white';

    if (isAdmin) {
        document.getElementById('admin-btn').classList.remove('hidden');
    }
    
    // Fetch Data
    fetchFromCloud();
}

async function fetchFromCloud() {
    console.log("Fetching data...");
    const { data, error } = await supabaseClient
        .from('sales_data')
        .select('content')
        .eq('id', 1)
        .single();

    if (error) {
        alert("Error loading data. Check console.");
        console.error(error);
    } else if (data) {
        db = data.content;
        renderTable();
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

    // Body
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

    // Total Row
    if (data.total) {
        const tr = document.createElement('tr');
        tr.style.fontWeight = "bold";
        tr.style.background = "#eef";
        Object.values(data.total).forEach(val => {
            const td = document.createElement('td');
            td.innerText = val.toLocaleString();
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

// --- ADMIN LOGIC ---
function openAdminPanel() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('json-input').value = JSON.stringify(db, null, 4);
}

function closeAdminPanel() {
    document.getElementById('admin-modal').classList.add('hidden');
}

async function saveJsonData() {
    try {
        const newContent = JSON.parse(document.getElementById('json-input').value);
        
        const { error } = await supabaseClient
            .from('sales_data')
            .update({ content: newContent })
            .eq('id', 1);

        if (error) throw error;

        alert("Saved to Cloud!");
        closeAdminPanel();
        fetchFromCloud(); // Refresh screen
    } catch (e) {
        alert("Error: " + e.message);
    }
}

// Event Listeners
document.getElementById('view-selector').addEventListener('change', renderTable);