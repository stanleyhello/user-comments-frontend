const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const refreshSummaryBtn = document.getElementById('refreshSummary');
    const summaryText = document.getElementById('summaryText');
    const submitQueryBtn = document.getElementById('submitQuery');
    const queryInput = document.getElementById('queryInput');
    const queryResultText = document.getElementById('queryResultText');

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const companyInput = document.getElementById('companyInput');
        const commentInput = document.getElementById('commentInput');

        try {
            const response = await fetch(`${BACKEND_URL}/submit_comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: companyInput.value,
                    comment: commentInput.value
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Comment submitted successfully!');
                companyInput.value = '';
                commentInput.value = '';
                fetchSummary();
            } else {
                alert('Error submitting comment: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the comment.');
        }
    });

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

    // Initial summary fetch
    fetchSummary();

    // Refresh summary button
    refreshSummaryBtn.addEventListener('click', fetchSummary);

    // Query comments button
    submitQueryBtn.addEventListener('click', queryComments);
});
