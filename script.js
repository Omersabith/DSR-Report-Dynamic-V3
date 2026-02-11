// --- DATABASE CONFIGURATION ---
const SUPABASE_URL = 'https://iyxpvbvpampykfjffgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

let db = {}; 
let isAdmin = false;

// --- CORE DATA LOGIC ---

async function loadFromCloud() {
    // This fetches the data from Supabase so everyone sees the same thing
    const { data, error } = await supabaseClient
        .from('sales_data')
        .select('content')
        .eq('id', 1)
        .single();

    if (error) {
        console.error("Fetch Error:", error);
    } else {
        db = data.content;
        switchView();
    }
}

async function saveJsonData() {
    try {
        const updatedContent = JSON.parse(document.getElementById('json-input').value);
        
        // This saves the data to Supabase globally
        const { error } = await supabaseClient
            .from('sales_data')
            .update({ content: updatedContent })
            .eq('id', 1);

        if (error) throw error;

        db = updatedContent;
        alert("Global Update Successful! Everyone now sees the updated Page 4 and totals.");
        closeAdminPanel();
        switchView();
    } catch (e) {
        alert("JSON Error: " + e.message);
    }
}

// --- UI LOGIC ---

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

function loadDashboard() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    if(isAdmin) document.getElementById('admin-btn').classList.remove('hidden');
    loadFromCloud();
}

function switchView() {
    const viewKey = document.getElementById('view-selector').value;
    const data = db[viewKey];
    if(!data) return;

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
        trTotal.style.backgroundColor = "#f0f4f8";
        Object.values(data.total).forEach(val => {
            const td = document.createElement('td');
            td.innerText = typeof val === 'number' ? val.toLocaleString() : val;
            trTotal.appendChild(td);
        });
        tbody.appendChild(trTotal);
    }
}

function printReport() { window.print(); }

function openAdminPanel() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('json-input').value = JSON.stringify(db, null, 4);
}

function closeAdminPanel() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function exportTableToCSV() {
    const viewKey = document.getElementById('view-selector').value;
    const data = db[viewKey];
    let csv = [data.headers.join(",")];
    data.rows.forEach(row => csv.push(Object.values(row).join(",")));
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv.join("\n")], {type: "text/csv"}));
    link.download = `${viewKey}.csv`;
    link.click();
}

// Start by fetching data
loadFromCloud();