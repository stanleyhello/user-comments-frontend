const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show active tab pane
            tabPanes.forEach(pane => {
                if (pane.id === `${tabId}-tab`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
            
            // Save active tab to localStorage
            localStorage.setItem('activeTab', tabId);
        });
    });
    
    // Load active tab from localStorage
    const savedTab = localStorage.getItem('activeTab') || 'summary';
    document.querySelector(`.tab-btn[data-tab="${savedTab}"]`).click();

    // DOM Elements
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

    // Initialize charts
    let issuesChart;

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
