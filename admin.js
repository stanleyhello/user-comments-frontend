const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const dashboardTab = document.getElementById('dashboard-tab');
    const reportsTab = document.getElementById('reports-tab');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pageTitle = document.getElementById('page-title');
    
    // Initialize charts
    let topicsChart = null;
    let sentimentChart = null;
    
    // Initialize the page
    function initPage() {
        // Set up tab switching
        setupTabs();
        
        // Initialize charts
        initCharts();
        
        // Set up event listeners
        setupEventListeners();
        
        // Show dashboard by default
        showTab('dashboard');
    }
    
    function setupTabs() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1); // Remove the '#'
                showTab(target);
                
                // Update active state
                navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
            });
        });
    }
    
    function showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show the selected tab
        const tabToShow = document.getElementById(`${tabName}-tab`);
        if (tabToShow) {
            tabToShow.classList.add('active');
        }
        
        // Update page title
        pageTitle.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
        
        // Handle any tab-specific initialization
        if (tabName === 'reports') {
            updateCharts();
        }
    }
    
    function initCharts() {
        // Initialize Topics Chart
        const topicsCtx = document.getElementById('topicsChart').getContext('2d');
        topicsChart = new Chart(topicsCtx, {
            type: 'bar',
            data: {
                labels: ['Customer Service', 'Product Quality', 'Shipping', 'Pricing', 'Website'],
                datasets: [{
                    label: 'Mentions',
                    data: [12, 19, 8, 15, 7],
                    backgroundColor: [
                        'rgba(0, 194, 168, 0.7)',
                        'rgba(0, 194, 168, 0.5)',
                        'rgba(0, 194, 168, 0.3)',
                        'rgba(0, 194, 168, 0.4)',
                        'rgba(0, 194, 168, 0.2)'
                    ],
                    borderColor: [
                        'rgba(0, 194, 168, 1)',
                        'rgba(0, 194, 168, 0.8)',
                        'rgba(0, 194, 168, 0.6)',
                        'rgba(0, 194, 168, 0.7)',
                        'rgba(0, 194, 168, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        // Initialize Sentiment Chart
        const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
        sentimentChart = new Chart(sentimentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Positive',
                        data: [65, 59, 80, 81, 76, 85],
                        borderColor: 'rgba(0, 194, 168, 1)',
                        backgroundColor: 'rgba(0, 194, 168, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Negative',
                        data: [28, 48, 40, 19, 36, 27],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        titleColor: '#F9FAFB',
                        bodyColor: '#E5E7EB',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 12,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }
                }
            }
        });
    }
    
    function updateCharts() {
        // In a real app, you would fetch new data here and update the charts
        console.log('Updating charts with fresh data...');
        
        // Example of how to update chart data:
        // if (topicsChart) {
        //     topicsChart.data.datasets[0].data = [newData1, newData2, ...];
        //     topicsChart.update();
        // }
    }
    
    function setupEventListeners() {
        // Refresh summary button
        const refreshBtn = document.getElementById('refreshSummary');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                // Show loading state
                const summaryText = document.getElementById('summaryText');
                summaryText.innerHTML = 'Generating summary... <i class="fas fa-spinner fa-spin"></i>';
                
                // In a real app, you would fetch the summary from your backend
                setTimeout(() => {
                    summaryText.textContent = "Here's your updated summary with the latest user feedback trends and insights...";
                }, 1500);
            });
        }
        
        // Generate sample data button
        const generateBtn = document.getElementById('generateDataBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                const prompt = document.getElementById('promptInput').value;
                const count = document.getElementById('countInput').value;
                const statusEl = document.getElementById('generateStatus');
                
                if (!prompt) {
                    showStatus('Please enter a prompt', 'error', statusEl);
                    return;
                }
                
                // Show loading state
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                
                // In a real app, you would call your backend API here
                console.log(`Generating ${count} sample comments with prompt: ${prompt}`);
                
                // Simulate API call
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.textContent = 'Generate Data';
                    showStatus(`Successfully generated ${count} sample comments!`, 'success', statusEl);
                }, 2000);
            });
        }
        
        // AI Query submission
        const queryInput = document.getElementById('queryInput');
        const submitQueryBtn = document.getElementById('submitQuery');
        const queryResult = document.getElementById('queryResultText');
        
        if (submitQueryBtn && queryInput) {
            const handleQuery = () => {
                const question = queryInput.value.trim();
                if (!question) return;
                
                // Show loading state
                queryResult.innerHTML = 'Thinking... <i class="fas fa-spinner fa-spin"></i>';
                
                // In a real app, you would call your backend API here
                setTimeout(() => {
                    queryResult.innerHTML = `
                        <p><strong>Question:</strong> ${question}</p>
                        <p><strong>Answer:</strong> Based on the latest user feedback, I can provide insights about ${question.toLowerCase()}.</p>
                        <div class="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <p class="font-medium">Analysis based on 142 recent comments</p>
                            <ul class="list-disc pl-5 mt-1 space-y-1">
                                <li>72% positive sentiment</li>
                                <li>15% negative sentiment</li>
                                <li>13% neutral sentiment</li>
                            </ul>
                        </div>
                    `;
                }, 1500);
            };
            
            submitQueryBtn.addEventListener('click', handleQuery);
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleQuery();
            });
        }
    }
    
    function showStatus(message, type, element) {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'status-message';
        element.classList.add(type);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.className = 'status-message';
        }, 5000);
    }
    
    // Initialize the page
    initPage();
});

document.addEventListener('DOMContentLoaded', () => {
    const summaryText = document.getElementById('summaryText');
    const refreshSummaryBtn = document.getElementById('refreshSummary');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQuery');
    const queryResultText = document.getElementById('queryResultText');
    const suggestionButtons = document.querySelectorAll('.suggestion');
    const issuesChartCanvas = document.getElementById('issuesChart');
    const issuesChartError = document.getElementById('issuesChartError');
    
    // Generate Sample Data Elements
    const generateDataBtn = document.getElementById('generateDataBtn');
    const promptInput = document.getElementById('promptInput');
    const countInput = document.getElementById('countInput');
    const generateStatus = document.getElementById('generateStatus');

    // Generate Sample Data
    async function generateSampleData() {
        const prompt = promptInput.value.trim();
        const count = parseInt(countInput.value, 10);

        // Validate inputs
        if (!prompt) {
            showStatus('Please enter a prompt', 'error');
            return;
        }


        if (isNaN(count) || count < 1 || count > 20) {
            showStatus('Please enter a number between 1 and 20', 'error');
            return;
        }


        try {
            // Disable button and show loading state
            generateDataBtn.disabled = true;
            showStatus('Generating sample comments...', 'info');

            const response = await fetch(`${BACKEND_URL}/generate_comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, count })
            });

            const result = await response.json();

            if (response.ok) {
                showStatus(`Successfully generated ${result.count} sample comments!`, 'success');
                // Refresh the summary to show new data
                fetchSummary();
            } else {
                showStatus(`Error: ${result.error || 'Failed to generate sample data'}`, 'error');
            }
        } catch (error) {
            console.error('Error generating sample data:', error);
            showStatus('An error occurred while generating sample data', 'error');
        } finally {
            generateDataBtn.disabled = false;
        }
    }


    // Helper function to show status messages
    function showStatus(message, type = 'info') {
        generateStatus.textContent = message;
        generateStatus.className = 'status-message';
        if (type !== 'info') {
            generateStatus.classList.add(type);
        }
    }

    // Event listener for generate button
    if (generateDataBtn) {
        generateDataBtn.addEventListener('click', generateSampleData);
    }

    // Load and render issues chart
    async function loadIssueChart() {
        try {
            const response = await fetch(`${BACKEND_URL}/chart/issues`);
            const result = await response.json();

            if (result.status === 'success') {
                const issues = result.issues;
                
                // Hide any previous error
                issuesChartError.textContent = '';

                // Create chart if issues exist
                if (Object.keys(issues).length > 0) {
                    new Chart(issuesChartCanvas, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(issues),
                            datasets: [{
                                label: 'Frequency of Issues',
                                data: Object.values(issues),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Number of Mentions'
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Most Common Issues in User Comments'
                                }
                            }
                        }
                    });
                } else {
                    issuesChartError.textContent = 'No issues found in comments.';
                }
            } else {
                issuesChartError.textContent = result.message || 'Error fetching issues.';
            }
        } catch (error) {
            console.error('Error loading issues chart:', error);
            issuesChartError.textContent = 'Failed to load issues chart.';
        }
    }

    // Fetch and display summary
    async function fetchSummary() {
        // Show loading state
        summaryText.textContent = 'Loading summary...';
        summaryText.className = 'summary-text loading';
        
        try {
            const response = await fetch(`${BACKEND_URL}/get_summary`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();

            if (result.status === 'success') {
                summaryText.textContent = result.summary || 'No summary available.';
                summaryText.className = 'summary-text';
            } else {
                throw new Error(result.message || 'Failed to fetch summary');
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
            summaryText.textContent = 'Failed to fetch summary. Please try again.';
            summaryText.className = 'summary-text error';
        }
    }
    
    // Add click event listener to refresh button
    if (refreshSummaryBtn) {
        refreshSummaryBtn.addEventListener('click', fetchSummary);
    }

    // Query comments
    async function queryComments(query, button = null) {
        // Disable buttons during query
        submitQueryBtn.disabled = true;
        suggestionButtons.forEach(btn => btn.disabled = true);
        
        // Clear previous result
        queryResultText.textContent = 'Searching...';

        try {
            const response = await fetch(`${BACKEND_URL}/query_comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                queryResultText.textContent = result.answer || 'No answer found.';
            } else {
                queryResultText.textContent = 'Error querying comments: ' + result.message;
            }
        } catch (error) {
            console.error('Error:', error);
            queryResultText.textContent = 'An error occurred while querying comments.';
        } finally {
            // Re-enable buttons
            submitQueryBtn.disabled = false;
            suggestionButtons.forEach(btn => btn.disabled = false);
        }
    }

    // Event listeners for manual query
    submitQueryBtn.addEventListener('click', () => {
        queryComments(queryInput.value);
    });

    // Event listeners for suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const query = button.getAttribute('data-query');
            queryInput.value = query;
            queryComments(query, button);
        });
    });

    // Load sentiment chart
    async function loadSentimentChart() {
        try {
            const response = await fetch(`${BACKEND_URL}/chart/sentiment`);
            const result = await response.json();

            const sentimentChartCanvas = document.getElementById('sentimentChart');
            const sentimentChartError = document.getElementById('sentimentChartError');

            if (result.status === 'success') {
                const sentimentTrends = result.sentiment_trends;
                
                // Hide any previous error
                sentimentChartError.textContent = '';

                // Create chart if sentiment data exists
                if (Object.keys(sentimentTrends).length > 0) {
                    new Chart(sentimentChartCanvas, {
                        type: 'line',
                        data: {
                            labels: Object.keys(sentimentTrends),
                            datasets: [{
                                label: 'Sentiment Score',
                                data: Object.values(sentimentTrends),
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                                fill: false,
                                pointBackgroundColor: Object.values(sentimentTrends).map(score => 
                                    score > 0.3 ? 'green' : (score < -0.3 ? 'red' : 'gray')
                                )
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 1,
                                    min: -1,
                                    title: {
                                        display: true,
                                        text: 'Sentiment Score'
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'User Sentiment Trends'
                                }
                            }
                        }
                    });
                } else {
                    sentimentChartError.textContent = 'No sentiment data available.';
                }
            } else {
                sentimentChartError.textContent = result.message || 'Error fetching sentiment data.';
            }
        } catch (error) {
            console.error('Error loading sentiment chart:', error);
            document.getElementById('sentimentChartError').textContent = 'Failed to load sentiment chart.';
        }
    }

    // Initial fetches
    Promise.all([
        fetchSummary(),
        loadIssueChart(),
        loadSentimentChart()
    ]).catch(error => {
        console.error('Error during initial data loading:', error);
    });
    
    // Add enter key support for the prompt input
    if (promptInput) {
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateSampleData();
            }
        });
    }
});
