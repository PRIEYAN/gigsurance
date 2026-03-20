// Mock data for workers
export const workers = [
    { id: 1, name: "Ravi Kumar", phone: "+91 98765 43210", city: "Chennai", zone: "Velachery", persona: "food", trustScore: 82, policyStatus: "active", premiumStatus: "paid", platform: ["Swiggy", "Zomato"], joinedDate: "2024-08-15", weeksPaid: 4, upiId: "ravi.k@upi" },
    { id: 2, name: "Meena Srinivasan", phone: "+91 94432 11098", city: "Chennai", zone: "T.Nagar", persona: "quick", trustScore: 67, policyStatus: "active", premiumStatus: "paid", platform: ["Zepto", "Blinkit"], joinedDate: "2024-09-02", weeksPaid: 2, upiId: "meena.s@upi" },
    { id: 3, name: "Kabir Mistry", phone: "+91 91234 56789", city: "Chennai", zone: "Adyar", persona: "ecom", trustScore: 41, policyStatus: "suspended", premiumStatus: "missed", platform: ["Amazon"], joinedDate: "2024-07-20", weeksPaid: 0, upiId: "kabir.m@upi" },
    { id: 4, name: "Arjun Deshpande", phone: "+91 99887 76655", city: "Chennai", zone: "Anna Nagar", persona: "food", trustScore: 91, policyStatus: "active", premiumStatus: "paid", platform: ["Zomato"], joinedDate: "2024-06-01", weeksPaid: 8, upiId: "arjun.d@upi" },
    { id: 5, name: "Priya Venkatesh", phone: "+91 90011 22334", city: "Chennai", zone: "Porur", persona: "quick", trustScore: 75, policyStatus: "active", premiumStatus: "paid", platform: ["Zepto"], joinedDate: "2024-10-10", weeksPaid: 3, upiId: "priya.v@upi" },
    { id: 6, name: "Suresh Babu", phone: "+91 87776 65544", city: "Chennai", zone: "Tambaram", persona: "ecom", trustScore: 58, policyStatus: "active", premiumStatus: "paid", platform: ["Flipkart", "Amazon"], joinedDate: "2024-08-28", weeksPaid: 1, upiId: "suresh.b@upi" },
    { id: 7, name: "Anjali Mehta", phone: "+91 95544 33221", city: "Chennai", zone: "Nungambakkam", persona: "food", trustScore: 88, policyStatus: "active", premiumStatus: "paid", platform: ["Swiggy"], joinedDate: "2024-05-15", weeksPaid: 12, upiId: "anjali.m@upi" },
    { id: 8, name: "Deepak Raj", phone: "+91 93322 11009", city: "Chennai", zone: "Perambur", persona: "ecom", trustScore: 32, policyStatus: "flagged", premiumStatus: "missed", platform: ["Flipkart"], joinedDate: "2024-09-18", weeksPaid: 0, upiId: "deepak.r@upi" },
];

export const payouts = [
    { id: 1, worker: "Ravi Kumar", zone: "Velachery", reason: "Heavy Rain", amount: 1800, status: "paid", time: "3 min ago", timestamp: "2024-12-19T16:00:00" },
    { id: 2, worker: "Meena Srinivasan", zone: "T.Nagar", reason: "Heavy Rain", amount: 1200, status: "paid", time: "4 min ago", timestamp: "2024-12-19T15:59:00" },
    { id: 3, worker: "Arjun Deshpande", zone: "Anna Nagar", reason: "App Crash", amount: 950, status: "processing", time: "12 min ago", timestamp: "2024-12-19T15:51:00" },
    { id: 4, worker: "Kabir Mistry", zone: "Adyar", reason: "Heavy Rain", amount: 1800, status: "flagged", time: "18 min ago", timestamp: "2024-12-19T15:45:00" },
    { id: 5, worker: "Priya Venkatesh", zone: "Porur", reason: "Heavy Rain", amount: 1800, status: "paid", time: "25 min ago", timestamp: "2024-12-19T15:38:00" },
    { id: 6, worker: "Suresh Babu", zone: "Tambaram", reason: "Flooding", amount: 800, status: "paid", time: "31 min ago", timestamp: "2024-12-19T15:32:00" },
    { id: 7, worker: "Anjali Mehta", zone: "Nungambakkam", reason: "Curfew", amount: 960, status: "processing", time: "45 min ago", timestamp: "2024-12-19T15:18:00" },
    { id: 8, worker: "Deepak Raj", zone: "Perambur", reason: "Heavy Rain", amount: 1800, status: "flagged", time: "1 hr ago", timestamp: "2024-12-19T15:03:00" },
];

export const disruptions = [
    { id: 1, type: "rain", icon: "🌧", title: "Heavy Rain", zone: "Velachery", severity: "HIGH", confidence: 94, timestamp: "16:03", affectedWorkers: 247, estimatedPayout: 120000, lat: 12.9816, lng: 80.2209 },
    { id: 2, type: "rain", icon: "🌧", title: "Moderate Rain", zone: "T.Nagar", severity: "MEDIUM", confidence: 78, timestamp: "15:47", affectedWorkers: 134, estimatedPayout: 65000, lat: 13.0418, lng: 80.2341 },
    { id: 3, type: "flood", icon: "🌊", title: "Flash Flood", zone: "Ambattur", severity: "CATASTROPHIC", confidence: 89, timestamp: "15:22", affectedWorkers: 89, estimatedPayout: 89000, lat: 13.1143, lng: 80.1548 },
    { id: 4, type: "crash", icon: "📱", title: "Swiggy App Crash", zone: "Chennai-Wide", severity: "MEDIUM", confidence: 99, timestamp: "14:55", affectedWorkers: 412, estimatedPayout: 195000, lat: 13.0827, lng: 80.2707 },
    { id: 5, type: "wind", icon: "💨", title: "Strong Winds", zone: "Marina", severity: "LOW", confidence: 65, timestamp: "14:30", affectedWorkers: 23, estimatedPayout: 11500, lat: 13.0500, lng: 80.2824 },
];

export const zones = [
    { id: "velachery", name: "Velachery", status: "disruption", workers: 247, severity: "HIGH", payout: 120000, lat: 12.9816, lng: 80.2209 },
    { id: "tnagar", name: "T.Nagar", status: "monitoring", workers: 134, severity: "MEDIUM", payout: 65000, lat: 13.0418, lng: 80.2341 },
    { id: "ambattur", name: "Ambattur", status: "disruption", workers: 89, severity: "CATASTROPHIC", payout: 89000, lat: 13.1143, lng: 80.1548 },
    { id: "annanagar", name: "Anna Nagar", status: "clear", workers: 178, severity: "NONE", payout: 0, lat: 13.0888, lng: 80.2101 },
    { id: "adyar", name: "Adyar", status: "monitoring", workers: 95, severity: "LOW", payout: 15000, lat: 13.0067, lng: 80.2570 },
    { id: "porur", name: "Porur", status: "clear", workers: 67, severity: "NONE", payout: 0, lat: 13.0378, lng: 80.1566 },
    { id: "tambaram", name: "Tambaram", status: "monitoring", workers: 123, severity: "MEDIUM", payout: 45000, lat: 12.9250, lng: 80.1000 },
    { id: "nungambakkam", name: "Nungambakkam", status: "clear", workers: 88, severity: "NONE", payout: 0, lat: 13.0604, lng: 80.2496 },
];

export const fraudCases = [
    { id: 1, worker: "Deepak Raj", workerId: "GIG-1008", fraudType: "GPS Spoofing", evidence: "Device GPS placed 12km from claimed disruption zone. Speed: 0 km/h for 3 hours.", confidence: "HIGH", status: "pending", amount: 1800, claimedZone: "Velachery", actualZone: "Perambur" },
    { id: 2, worker: "Kabir Mistry", workerId: "GIG-1003", fraudType: "Stationary Device", evidence: "No movement detected for entire disruption window. Delivery app shows 0 trips.", confidence: "MEDIUM", status: "investigating", amount: 1800, claimedZone: "Adyar", actualZone: "Adyar" },
    { id: 3, worker: "Unknown-X", workerId: "GIG-1099", fraudType: "Multi-Device", evidence: "Same UPI linked to 3 active policies across Chennai and Bangalore.", confidence: "HIGH", status: "pending", amount: 5400, claimedZone: "Velachery", actualZone: "Various" },
];

export const agentLogs: Record<string, string[]> = {
    "agent1": [
        "[16:03:42] Fetching IMD weather API...",
        "[16:03:43] Chennai rainfall: 112mm — SEVERE threshold exceeded",
        "[16:03:44] NewsAPI: 3 flood-related articles found",
        "[16:03:44] AQI API: Fetching PM2.5 data...",
        "[16:03:45] Disaster.io API: No cyclone warnings",
        "[16:03:46] NDMA feed: Chennai flood alert ACTIVE",
        "[16:03:47] Data collection complete — 6 sources",
    ],
    "agent2": [
        "[16:03:48] Received data from Agent 1",
        "[16:03:48] Running zone classifier model v2.4",
        "[16:03:49] Disruption type: HEAVY_RAIN + FLOOD",
        "[16:03:50] Primary zone: Velachery (confidence: 94%)",
        "[16:03:51] Secondary zone: T.Nagar (confidence: 78%)",
        "[16:03:52] Severity: HIGH — Payout threshold: ₹1,800",
        "[16:03:53] Output ready → Agent 3",
    ],
    "agent3": [
        "[16:03:55] Auditor activated",
        "[16:03:56] Pulling workers from Velachery zone...",
        "[16:03:57] 247 active workers found",
        "[16:03:58] Pre-screening trust scores...",
        "[16:03:59] 15 workers flagged for review",
        "[16:04:00] Net eligible: 232 workers",
        "[16:04:01] Total payout: ₹4,17,600",
    ],
    "agent4": [
        "[16:04:02] Executor online",
        "[16:04:03] UPI mock endpoint ready",
        "[16:04:04] Dispatching batch 1/5 (47 workers)...",
        "[16:04:05] Batch 1: 47/47 success",
        "[16:04:06] Dispatching batch 2/5...",
        "[16:04:07] Batch 2: 46/47 — 1 UPI rejected",
        "[16:04:08] Queuing retry for rejected UPI...",
    ],
};

export const analyticsData = {
    policyGrowth: [
        { month: "Jul", policies: 4200 },
        { month: "Aug", policies: 5800 },
        { month: "Sep", policies: 7300 },
        { month: "Oct", policies: 9100 },
        { month: "Nov", policies: 11200 },
        { month: "Dec", policies: 12847 },
    ],
    payoutByDisruption: [
        { type: "Heavy Rain", amount: 284000 },
        { type: "Flooding", amount: 156000 },
        { type: "App Crash", amount: 98000 },
        { type: "Curfew", amount: 45000 },
        { type: "Cyclone", amount: 23000 },
    ],
    workerPersona: [
        { name: "Food Delivery", value: 54, color: "#FF6B2B" },
        { name: "Quick Commerce", value: 31, color: "#A855F7" },
        { name: "Ecommerce", value: 15, color: "#3B82F6" },
    ],
    dailyPayouts: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        amount: Math.floor(Math.random() * 500000 + 200000),
        workers: Math.floor(Math.random() * 300 + 100),
    })),
    premiumTrend: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        basic: 29 + Math.random() * 2 - 1,
        standard: 59 + Math.random() * 4 - 2,
        premium: 99 + Math.random() * 6 - 3,
    })),
};

export const cities = ["Chennai", "Mumbai", "Bangalore", "Delhi", "Hyderabad"];

export const dashboardStats = {
    activePolicies: { value: 12847, change: 234, label: "Active Policies", trend: "up" },
    disruptions: { value: 3, zones: ["Velachery", "T.Nagar", "Ambattur"], label: "Live Disruptions" },
    payoutsToday: { value: 482000, workers: 847, label: "Payouts Today" },
    fundPool: { value: 24000000, utilization: 68, label: "Fund Pool Balance" },
};
