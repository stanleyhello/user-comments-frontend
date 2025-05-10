const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', () => {
    const summaryText = document.getElementById('summaryText');
    const refreshSummaryBtn = document.getElementById('refreshSummary');
    const queryInput = document.getElementById('queryInput');
    const submitQueryBtn = document.getElementById('submitQuery');
    const queryResultText = document.getElementById('queryResultText');
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
    async function queryComments() {
        try {
            const response = await fetch(`${BACKEND_URL}/query_comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: queryInput.value
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
        }
    }

    // Event listeners
    refreshSummaryBtn.addEventListener('click', fetchSummary);
    submitQueryBtn.addEventListener('click', queryComments);

    // Initial fetch
    fetchSummary();
});
