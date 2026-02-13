// 1. Connection (Update these with your actual details)
const SB_URL = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const SB_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = window.supabase.createClient(SB_URL, SB_KEY);

function handleLogin(role) {
    console.log("Login button clicked for:", role); // This will show in console to prove it's working
    
    const input = document.getElementById('access-code');
    const error = document.getElementById('error-msg');
    
    // Using 1234 as the default for now - update as needed
    if (input.value === '1234') {
        // HIDE LOGIN
        document.getElementById('login-container').style.display = 'none';
        
        // SHOW DASHBOARD
        const dash = document.getElementById('dashboard-main');
        dash.style.display = 'block';

        if (role === 'admin') {
            document.getElementById('admin-tag').style.display = 'inline-block';
        }

        // FETCH DATA
        loadSalesPulseData();
    } else {
        error.innerText = "Invalid Access Code";
    }
}

async function loadSalesPulseData() {
    try {
        const { data, error } = await supabaseClient
            .from('sales_data')
            .select('payload')
            .eq('id', 1)
            .single();

        if (error) throw error;
        
        const p = data.payload;
        
        // Update Numbers
        document.getElementById('disp-revenue').innerText = `$${p.total_revenue.toLocaleString()}`;
        document.getElementById('disp-units').innerText = p.total_units.toLocaleString();

        // Initialize Charts
        initCharts(p);
    } catch (err) {
        console.error("Data Load Error:", err);
    }
}

function initCharts(p) {
    // Executive Performance (Anas, Suhail, Salam, Manseer)
    new Chart(document.getElementById('execBarChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(p.individual_sales),
            datasets: [{
                label: 'Executive Performance',
                data: Object.values(p.individual_sales),
                backgroundColor: '#38bdf8'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}