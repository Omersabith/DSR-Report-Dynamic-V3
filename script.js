// CONFIGURATION
const SUPABASE_URL = "https://iyxpvbvpampykfjffgol.supabase.co";
const SUPABASE_KEY = "sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46";
const DB_TABLE = "sales_data";
const ROW_ID = 1;

// CHART INSTANCES
let catChart = null;
let trendChart = null;
let trackerChart = null;

// --- 1. AUTHENTICATION ---
function attemptLogin() {
    const u = document.getElementById('username').value.toLowerCase().trim();
    const p = document.getElementById('password').value.trim();
    const loginBox = document.getElementById('login-container');
    const dashboard = document.getElementById('dashboard-container');
    const adminBtn = document.getElementById('admin-btn');
    const errorMsg = document.getElementById('error-msg');

    if (u === 'admin' && p === 'password123') {
        document.body.style.display = 'block'; 
        loginBox.classList.add('hidden');
        dashboard.classList.remove('hidden');
        adminBtn.classList.remove('hidden'); 
        loadDashboard();
    } else if (u === 'guest' && p === '1234') {
        document.body.style.display = 'block';
        loginBox.classList.add('hidden');
        dashboard.classList.remove('hidden');
        adminBtn.classList.add('hidden'); 
        loadDashboard();
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function logout() { location.reload(); }
function printReport() { window.print(); }

// --- 2. DATA FETCHING ---
async function loadDashboard() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${DB_TABLE}?id=eq.${ROW_ID}&select=content`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        if (data.length > 0) {
            const content = data[0].content;
            renderKPIs(content);
            renderCharts(content);
            renderTable1(content.individual_sales);
            renderTable2(content.active_period);
            renderTable3(content.monthly_sales);
            renderTable4(content.channel_sales);
            renderTable5(content.category_history);
        }
    } catch (error) { console.error("Fetch Error:", error); }
}

// --- 3. RENDER VISUALS ---
function renderKPIs(data) {
    if(data.kpi_summary) {
        document.getElementById('kpi-revenue').innerText = formatCurrency(data.kpi_summary.total_revenue);
        document.getElementById('kpi-growth').innerText = data.kpi_summary.growth;
        document.getElementById('kpi-top').innerText = data.kpi_summary.top_performer;
    }
}

function renderCharts(data) {
    if (catChart) catChart.destroy();
    if (trendChart) trendChart.destroy();
    if (trackerChart) trackerChart.destroy();

    // 1. Daily Tracker Chart (New)
    const trackerData = data.daily_tracker || [];
    const trackerCtx = document.getElementById('trackerChart').getContext('2d');
    const trackerLabels = trackerData.length > 0 ? trackerData[0].history.map(h => h.date) : [];
    const trackerDatasets = trackerData.map((staff, i) => ({
        label: staff.name,
        data: staff.history.map(h => h.sales),
        borderColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3
    }));

    trackerChart = new Chart(trackerCtx, {
        type: 'line',
        data: { labels: trackerLabels, datasets: trackerDatasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: { y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } },
            plugins: { legend: { position: 'top', labels: { color: 'white' } } }
        }
    });

    // 2. Category Share
    const active = data.active_period || [];
    const catCtx = document.getElementById('categoryChart').getContext('2d');
    catChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: active.map(x => x.category),
            datasets: [{
                data: active.map(x => x.total),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: 'white' } } }
        }
    });

    // 3. Trend
    const monthly = data.monthly_sales || [];
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'bar',
        data: {
            labels: monthly.map(x => x.month),
            datasets: [{
                label: 'Total Revenue',
                data: monthly.map(x => x.total),
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } },
            plugins: { legend: { display: false } }
        }
    });
}

// --- 4. TABLE RENDERERS ---
function renderTable1(rows) {
    const tbody = document.querySelector('#t1-individual tbody');
    tbody.innerHTML = '';
    if(rows) rows.forEach(r => {
        tbody.innerHTML += `<tr>
            <td><strong>${r.name}</strong></td>
            <td>${formatCurrency(r.target)}</td>
            <td>${formatCurrency(r.last_day)}</td>
            <td class="highlight">${formatCurrency(r.mtd)}</td>
            <td class="${r.achieved > 80 ? 'text-success' : (r.achieved < 20 ? 'text-danger' : '')}">${r.achieved}%</td>
            <td>${formatCurrency(r.req_avg)}</td>
        </tr>`;
    });
}

function renderTable2(rows) {
    const tbody = document.querySelector('#t2-active tbody');
    tbody.innerHTML = '';
    if(rows) rows.forEach(r => {
        tbody.innerHTML += `<tr>
            <td>${r.category}</td>
            <td><strong>${formatCurrency(r.total)}</strong></td>
            <td>${formatCurrency(r.vol_ir)}</td>
            <td>${formatCurrency(r.vol_kdr)}</td>
            <td>${r.share}%</td>
        </tr>`;
    });
}

function renderTable3(rows) {
    const tbody = document.querySelector('#t3-monthly tbody');
    tbody.innerHTML = '';
    if(rows) rows.forEach(r => {
        tbody.innerHTML += `<tr>
            <td>${r.month}</td>
            <td><strong>${formatCurrency(r.total)}</strong></td>
            <td>${formatCurrency(r.vol_ir)}</td>
            <td>${formatCurrency(r.vol_kdr)}</td>
        </tr>`;
    });
}

function renderTable4(rows) {
    const tbody = document.querySelector('#t4-channel tbody');
    tbody.innerHTML = '';
    if(rows) rows.forEach(r => {
        tbody.innerHTML += `<tr>
            <td>${r.month}</td>
            <td><strong>${formatCurrency(r.total)}</strong></td>
            <td>${formatCurrency(r.lulu)}</td>
            <td>${formatCurrency(r.nesto)}</td>
            <td>${formatCurrency(r.msouq)}</td>
            <td>${formatCurrency(r.extra)}</td>
        </tr>`;
    });
}

function renderTable5(rows) {
    const tbody = document.querySelector('#t5-category tbody');
    tbody.innerHTML = '';
    if(rows) rows.forEach(r => {
        tbody.innerHTML += `<tr>
            <td>${r.category}</td>
            <td>${formatCurrency(r.jan)}</td>
            <td><strong>${formatCurrency(r.feb)}</strong></td>
            <td>${r.share}%</td>
        </tr>`;
    });
}

// --- 5. UTILITIES ---
function filterTables() {
    const input = document.getElementById('tableSearch').value.toLowerCase();
    const tables = document.querySelectorAll('table tbody'); 
    tables.forEach(tbody => {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(input) ? '' : 'none';
        });
    });
}

function formatCurrency(num) {
    return Number(num).toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toggleAdmin() { document.getElementById('admin-panel').classList.toggle('hidden'); }
async function validateAndPush() {
    try {
        const jsonPayload = JSON.parse(document.getElementById('json-input').value);
        await fetch(`${SUPABASE_URL}/rest/v1/${DB_TABLE}?id=eq.${ROW_ID}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: jsonPayload })
        });
        alert('Database Updated!'); location.reload();
    } catch (e) { alert('Invalid JSON'); }
}