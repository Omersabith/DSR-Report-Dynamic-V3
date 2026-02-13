const SUPABASE_URL = "https://ofvswjscvsmunonmclce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdnN3anNjdnNtdW5vbm1jbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1Nzc3OTcsImV4cCI6MjA1NDE1Mzc5N30.C6S6S0_T8S6S0_T8S6S0_T8S6S0_T8";

async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if ((user === 'admin' && pass === 'password123') || (user === 'guest' && pass === '1234')) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-wrapper').style.display = 'block';
        document.body.style.display = 'block'; 
        fetchData();
    }
}

async function fetchData() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/sales_data?id=eq.1`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const result = await response.json();
        renderUI(result[0].data_payload);
    } catch (err) { console.error("Fetch Error:", err); }
}

function renderUI(data) {
    // KPI Cards (Fixed NaN logic)
    document.getElementById('total-revenue').innerText = 
        (data.kpi_summary?.total_revenue || 0).toLocaleString() + " OMR";
    document.getElementById('growth-percent').innerText = 
        data.kpi_summary?.growth || "0%";
    document.getElementById('top-performer').innerText = 
        data.kpi_summary?.top_performer || "N/A";

    // Staff Table
    const tbody = document.getElementById('individual-table-body');
    tbody.innerHTML = (data.individual_sales || []).map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${(s.mtd || 0).toLocaleString()} OMR</td>
            <td>${s.qty || 0}</td>
        </tr>
    `).join('');
}