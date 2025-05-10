const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', () => {
    const summaryText = document.getElementById('summaryText');
    const refreshSummaryBtn = document.getElementById('refreshSummary');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQuery');
    const queryResultText = document.getElementById('queryResultText');
    const suggestionButtons = document.querySelectorAll('.suggestion');
    const issuesChartCanvas = document.getElementById('issuesChart');
    const issuesChartError = document.getElementById('issuesChartError');

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
        try {
            const response = await fetch(`${BACKEND_URL}/get_summary`);
            const result = await response.json();

            if (result.status === 'success') {
                summaryText.textContent = result.summary || 'No summary available.';
            } else {
                summaryText.textContent = 'Error fetching summary: ' + result.message;
            }
        } catch (error) {
            console.error('Error:', error);
            summaryText.textContent = 'An error occurred while fetching the summary.';
        }
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

    // Initial fetch
    fetchSummary();
    loadIssueChart();
});
