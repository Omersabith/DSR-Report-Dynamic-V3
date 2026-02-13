// 1. YOUR CONNECTION DATA
const SB_URL = 'https://iyxpvbvpampykfjffgol.supabase.co'; 
const SB_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// 2. THE LOGIN FUNCTION
async function handleLogin(role) {
    const inputField = document.getElementById('access-code');
    const errorMsg = document.getElementById('error-msg');
    
    // Set your desired password here (e.g., '1234')
    if (inputField.value === '1234') {
        console.log("Login successful as:", role);
        
        // Hide Login, Show Dashboard
        document.getElementById('login-container').style.display = 'none';
        const dashboard = document.getElementById('dashboard-main');
        dashboard.style.display = 'block';

        if (role === 'admin') {
            document.getElementById('admin-tag').style.display = 'inline-block';
        }

        // Trigger Data Load
        fetchDashboardData();
    } else {
        errorMsg.innerText = "Invalid Access Code. Please try again.";
    }
}

// 3. THE DATA FUNCTION
async function fetchDashboardData() {
    try {
        const { data, error } = await supabaseClient
            .from('sales_data')
            .select('payload')
            .eq('id', 1)
            .single();

        if (error) throw error;
        renderUI(data.payload);
    } catch (err) {
        console.error("Supabase Error:", err.message);
        document.getElementById('error-msg').innerText = "Data load failed. Check Supabase connection.";
    }
}

function renderUI(p) {
    document.getElementById('disp-revenue').innerText = `$${p.total_revenue.toLocaleString()}`;
    document.getElementById('disp-units').innerText = p.total_units.toLocaleString();

    // Render Charts (Standard Chart.js code)
    new Chart(document.getElementById('execBarChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(p.individual_sales),
            datasets: [{ label: 'Executive Sales', data: Object.values(p.individual_sales), backgroundColor: '#38bdf8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}