document.addEventListener("DOMContentLoaded", function() {
    const submissionsList = document.getElementById("submissionsList");

    fetch("/submissions")
    .then(response => response.json())
    .then(submissions => {
        submissions.forEach(submission => {
            const listItem = document.createElement("li");
            listItem.textContent = `Product: ${submission.productName}, SKU: ${submission.productSKU}, Quantity: ${submission.quantity}, Type: ${submission.transactionType}, Contact: ${submission.contactEmail}, Timestamp: ${submission.timestamp}`;
            submissionsList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to fetch submissions.");
    });
});
