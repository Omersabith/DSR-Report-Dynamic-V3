// --- DATABASE ---
const SUPABASE_URL = 'https://iyxpvbvpampykfjffgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

let db = {}; 
let isAdmin = false;

// 1. Initial Data Fetch
async function loadFromCloud() {
    console.log("Syncing Cloud Data...");
    const { data, error } = await supabaseClient
        .from('sales_data')
        .select('content')
        .eq('id', 1)
        .single();

    if (error) {
        console.error("Cloud Sync Error:", error);
    } else {
        db = data.content;
        // If the dashboard is visible, update the table
        if (!document.getElementById('dashboard-container').classList.contains('hidden')) {
            switchView();
        }
    }
}

// 2. Authentication
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        isAdmin = true;
        loadDashboard();
    } else {
        document.getElementById('login-error').innerText = "Incorrect credentials.";
    }
}

function loadDashboard() {
    document.body.style.alignItems = "flex-start"; // Shift UI to top
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    
    if (isAdmin) {
        document.getElementById('admin-btn').classList.remove('hidden');
    }
    
    // Ensure we have the absolute latest data on login
    loadFromCloud();
}

// 3. Rendering Table
function switchView() {
    const viewKey = document.getElementById('view-selector').value;
    const data = db[viewKey];
    if (!data) return;

    document.getElementById('table-title').innerText = data.title;
    
    const thead = document.getElementById('table-head');
    thead.innerHTML = "<tr>" + data.headers.map(h => `<th>${h}</th>`).join('') + "</tr>";

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = "";
    
    data.rows.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    if (data.total) {
        const trTotal = document.createElement('tr');
        trTotal.style.fontWeight = "bold";
        trTotal.style.backgroundColor = "#f8fafc";
        Object.values(data.total).forEach(val => {
            const td = document.createElement('td');
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            trTotal.appendChild(td);
        });
        tbody.appendChild(trTotal);
    }
}

// 4. Admin Functions
function openAdminPanel() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('json-input').value = JSON.stringify(db, null, 4);
}

function closeAdminPanel() {
    document.getElementById('admin-modal').classList.add('hidden');
}

async function saveJsonData() {
    try {
        const input = document.getElementById('json-input').value;
        const updated = JSON.parse(input);
        
        const { error } = await supabaseClient
            .from('sales_data')
            .update({ content: updated })
            .eq('id', 1);

        if (error) throw error;
        
        db = updated;
        alert("Success: Database Updated Globally.");
        closeAdminPanel();
        switchView();
    } catch (e) {
        alert("Error: Invalid JSON Format.");
    }
}

// Background sync on page load
loadFromCloud();