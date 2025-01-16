document.addEventListener("DOMContentLoaded", function () {
    const placeholder = "{{pod_ip}}";
    const storedIP = localStorage.getItem("pod_ip");

    // Function to replace all placeholders
    function replacePlaceholders(ip) {
        document.body.innerHTML = document.body.innerHTML.replaceAll(placeholder, ip || "Enter Pod IP");
    }

    // Initial replacement
    replacePlaceholders(storedIP);

    // Create an input form to set the IP
const formContainer = document.getElementById("pod-ip-form-container");
    if (formContainer) {
        formContainer.innerHTML = `
            <form id="set-pod-ip">
                <label style="font-weight: 700;" for="pod_ip">Enter your Pod IP:</label>
                <input style="border: 1px solid #ccc; outline: 1px solid #ccc; height: 1.5rem; padding:0px; padding-left:3px;padding-right:3px; type="text" id="pod_ip" value="${storedIP || ""}">
                <button class="md-button" style="height: 1.5rem; padding:0px; padding-left:3px;padding-right:3px;" type="submit">Save</button>
            </form>
        `;

        // Handle form submission
        document.getElementById("set-pod-ip").addEventListener("submit", function (e) {
            e.preventDefault();
            const ip = document.getElementById("pod_ip").value;
            localStorage.setItem("pod_ip", ip);
            replacePlaceholders(ip); // Update placeholders dynamically
            alert("Pod IP saved and updated!");
        });
    }
});
