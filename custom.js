document.addEventListener("DOMContentLoaded", function () {
    const placeholder = "{{pod_ip}}";
    let previousIP = localStorage.getItem("pod_ip") || "Enter Pod IP"; // Default value if no IP is set

    // Function to replace placeholders and previous IPs
    function replacePlaceholders(newIP) {
        // Use the new IP if provided, or fallback to default
        const ipToUse = newIP || "Enter Pod IP";

        // Replace all placeholders
        document.querySelectorAll(`[data-placeholder="${placeholder}"]`).forEach(element => {
            element.innerHTML = ipToUse;
        });

        // Replace links with the previous IP or placeholder
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.href.includes(previousIP)) {
                link.href = link.href.replace(previousIP, ipToUse);
            } else if (link.href.includes(placeholder)) {
                link.href = link.href.replace(placeholder, ipToUse);
            }
        });

        // Update the previous IP for the next replacement
        previousIP = ipToUse;
    }

    // Initial replacement
    replacePlaceholders(previousIP);

    // Add the form
    const formContainer = document.getElementById("pod-ip-form-container");
    if (formContainer) {
        formContainer.innerHTML = `
            <form id="set-pod-ip">
                <label style="font-weight: 700;" for="pod_ip">Enter your Pod IP:</label>
                <input style="border: 1px solid #ccc; outline: 1px solid #ccc; height: 1.5rem; padding:0px; padding-left:3px; padding-right:3px;" 
                       type="text" id="pod_ip" value="${previousIP}">
                <button class="md-button" style="height: 1.5rem; padding:0px; padding-left:3px;padding-right:3px;" type="submit">Save</button>
            </form>
        `;

        // Handle form submission
        document.getElementById("set-pod-ip").addEventListener("submit", function (e) {
            e.preventDefault();
            const newIP = document.getElementById("pod_ip").value;
            localStorage.setItem("pod_ip", newIP);
            replacePlaceholders(newIP); // Update placeholders dynamically
            alert("Pod IP saved and updated!");
        });
    }
});