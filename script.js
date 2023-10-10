document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("postForm");

    postForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const productName = document.getElementById("productName").value;
        const productSKU = document.getElementById("productSKU").value;
        const quantity = document.getElementById("quantity").value;
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const contactEmail = document.getElementById("contactEmail").value;

        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName,
                productSKU,
                quantity,
                transactionType,
                contactEmail,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                postForm.reset();
                alert("Submission successful!");
            } else {
                alert("Submission failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Submission failed. Please try again.");
        });
    });
});
