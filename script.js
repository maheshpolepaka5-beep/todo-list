let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");


// Add task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    data-action="complete"
                    data-id="${task.id}">

                <span>${task.text}</span>
            </div>

            <div class="task-buttons">
                <button class="edit-btn"
                    data-action="edit"
                    data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn"
                    data-action="delete"
                    data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCount();
}


// Event delegation
taskList.addEventListener("click", function(event) {

    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);

    if (!action) {
        return;
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    if (action === "delete") {

        tasks = tasks.filter(task => task.id !== id);

    }

    if (action === "edit") {

        const newText = prompt("Edit task:", task.text);

        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
        }

    }

    saveTasks();
    renderTasks();
});


// Complete task
taskList.addEventListener("change", function(event) {

    if (event.target.dataset.action !== "complete") {
        return;
    }

    const id = Number(event.target.dataset.id);

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = event.target.checked;
    }

    saveTasks();
    renderTasks();
});


// Filters
document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();
    });

});


// Task count
function updateCount() {

    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} active task${activeTasks !== 1 ? "s" : ""}`;
}


// Initial display
renderTasks();