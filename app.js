const BACKEND_URL = "https://user-comments-backend.onrender.com"; // Replace with your Render URL

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const companyInput = document.getElementById('companyInput');
    const commentInput = document.getElementById('commentInput');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BACKEND_URL}/submit_comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: companyInput.value,
                    comment: commentInput.value,
                    name: nameInput.value || null,
                    email: emailInput.value || null
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Comment submitted successfully!');
                companyInput.value = '';
                commentInput.value = '';
                nameInput.value = '';
                emailInput.value = '';
            } else {
                alert('Error submitting comment: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the comment.');
        }
    });
});
