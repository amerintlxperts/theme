console.log("[student-selector] file loaded");

document$.subscribe(async function () {
  console.log("[student-selector] document$.subscribe triggered");

  const STORAGE_KEY = "selectedStudent";
  const STUDENTS_FILE = "/ai/data/students.txt";

  async function loadStudents() {
    console.log("[student-selector] loading student file:", STUDENTS_FILE);

    const response = await fetch(STUDENTS_FILE, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load ${STUDENTS_FILE} (${response.status})`);
    }

    const text = await response.text();
    const names = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    const students = names.map((name, index) => {
      const id = `student${String(index + 1).padStart(2, "0")}`;
      return { id, name };
    });

    console.log("[student-selector] students loaded:", students);
    return students;
  }

  function renderStudentTable(students) {
    const container = document.querySelector("#student-assignment-table");
    if (!container) {
      console.warn("[student-selector] #student-assignment-table not found");
      return;
    }

    const rows = students.map(student => `
      <tr>
        <td><input type="radio" name="student" value="${student.id}"></td>
        <td><code>${student.id}</code></td>
        <td>${student.name}</td>
      </tr>
    `).join("");

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Student ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    console.log("[student-selector] table rendered");
  }

  function updateStudent(selectedId, students) {
    console.log("[student-selector] updateStudent() called with:", selectedId);

    const student = students.find(s => s.id === selectedId);
    const selectedName = student ? student.name : "Unknown Student";

    document.querySelectorAll(".student-var").forEach(el => {
      el.textContent = selectedId;
    });

    document.querySelectorAll(".student-name").forEach(el => {
      el.textContent = selectedName;
    });

    document.querySelectorAll(".student-link-fortiweb").forEach(el => {
      const url = `https://${selectedId}-fortiweb.eastus.cloudapp.azure.com:8443`;
      el.href = url;
      el.textContent = url;
    });

    document.querySelectorAll(".student-link-windows").forEach(el => {
      const host = `${selectedId}-windows.eastus.cloudapp.azure.com:3389`;
      el.href = `rdp://${selectedId}-windows.eastus.cloudapp.azure.com:3389`;
      el.textContent = host;
    });

    document.querySelectorAll(".student-link-ubuntu").forEach(el => {
      const cmd = `ssh fwbadmin@${selectedId}-ubuntu.eastus.cloudapp.azure.com`;
      el.href = `ssh://fwbadmin@${selectedId}-ubuntu.eastus.cloudapp.azure.com`;
      el.textContent = cmd;
    });

    console.log("[student-selector] page updated:", {
      selectedId,
      selectedName
    });
  }

  try {
    const students = await loadStudents();
    renderStudentTable(students);

    const radios = document.querySelectorAll('input[name="student"]');
    console.log("[student-selector] radios found:", radios.length);

    if (!radios.length) {
      console.warn("[student-selector] no radios found after rendering");
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultValue = saved && students.some(s => s.id === saved)
      ? saved
      : students[0].id;

    radios.forEach(radio => {
      if (radio.value === defaultValue) {
        radio.checked = true;
      }

      radio.addEventListener("change", event => {
        const value = event.target.value;
        console.log("[student-selector] radio changed:", value);
        localStorage.setItem(STORAGE_KEY, value);
        updateStudent(value, students);
      });
    });

    updateStudent(defaultValue, students);
  } catch (error) {
    console.error("[student-selector] error:", error);
  }
});
