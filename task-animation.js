/**
 * Task Manager - Task-specific Animations
 * Animations for task listing, completion, and management
 * Include this script on dashboard pages (user_page.php, admin_page.php, done.php)
 */

document.addEventListener("DOMContentLoaded", function () {
  initTaskCompletionEffects();
  initPriorityVisualizers();
  initTaskFilters();
  initTaskRowExpansion();

  // Check if this is the completed tasks page
  if (window.location.href.includes("done.php")) {
    initCompletedTaskEffects();
  }
});

/**
 * Task completion button effects
 * Animates the completion of tasks
 */
function initTaskCompletionEffects() {
  const completeButtons = document.querySelectorAll(
    'a[href*="complited"] button'
  );

  completeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the parent row
      const row = this.closest("tr");

      // Add completion animation
      row.classList.add("task-completing");

      // Change button text and disable it
      this.innerText = "Completing...";
      this.disabled = true;

      // Get the original href to redirect after animation
      const completeLink = this.closest("a").getAttribute("href");

      // Redirect after animation completes
      setTimeout(() => {
        window.location.href = completeLink;
      }, 800);
    });
  });
}

/**
 * Priority visualizers
 * Adds visual indicators for task priorities
 */
function initPriorityVisualizers() {
  const priorityCells = document.querySelectorAll(
    "td.priority-high, td.priority-medium, td.priority-low"
  );

  priorityCells.forEach((cell) => {
    // Create priority indicator
    const indicator = document.createElement("span");
    indicator.classList.add("priority-indicator");

    // Set indicator color based on priority
    if (cell.classList.contains("priority-high")) {
      indicator.classList.add("indicator-high");
    } else if (cell.classList.contains("priority-medium")) {
      indicator.classList.add("indicator-medium");
    } else {
      indicator.classList.add("indicator-low");
    }

    // Insert indicator before text
    cell.insertBefore(indicator, cell.firstChild);

    // Add pulsing animation for high priority
    if (cell.classList.contains("priority-high")) {
      setInterval(() => {
        indicator.classList.toggle("pulse");
      }, 2000);
    }
  });
}

/**
 * Task filters animation
 * Adds dropdown filter for tasks
 */
function initTaskFilters() {
  const taskTable = document.querySelector(".all-tasks table");

  if (taskTable) {
    // Create filter container
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("task-filter-container");

    // Create filter elements
    const filterLabel = document.createElement("span");
    filterLabel.classList.add("filter-label");
    filterLabel.innerText = "Filter by: ";

    const prioritySelect = document.createElement("select");
    prioritySelect.classList.add("filter-select");
    prioritySelect.innerHTML = `
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
        `;

    // Add elements to container
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(prioritySelect);

    // Insert filter before table
    taskTable.parentNode.insertBefore(filterContainer, taskTable);

    // Add filter functionality
    prioritySelect.addEventListener("change", function () {
      const value = this.value;
      const rows = taskTable.querySelectorAll("tr:not(:first-child)");

      rows.forEach((row) => {
        const priorityCell = row.querySelector("td:nth-child(4)");

        if (value === "all") {
          row.style.display = "";
          return;
        }

        // Check if the priority cell contains the selected class
        if (
          priorityCell &&
          priorityCell.classList.contains("priority-" + value)
        ) {
          row.style.display = "";

          // Add highlight animation
          row.classList.add("row-highlight");
          setTimeout(() => {
            row.classList.remove("row-highlight");
          }, 1000);
        } else {
          // Hide with fade out animation
          row.classList.add("row-fadeout");
          setTimeout(() => {
            row.style.display = "none";
            row.classList.remove("row-fadeout");
          }, 300);
        }
      });
    });
  }
}

/**
 * Task row expansion
 * Makes task rows expandable to show more details
 */
function initTaskRowExpansion() {
  const taskRows = document.querySelectorAll(
    ".all-tasks table tr:not(:first-child), .container table tr:not(:first-child)"
  );

  taskRows.forEach((row) => {
    // Get the description cell
    const descCell = row.querySelector("td:nth-child(3)");

    if (descCell && descCell.textContent.length > 30) {
      // Store the full description
      const fullDesc = descCell.textContent;

      // Truncate description
      const shortDesc = fullDesc.substring(0, 30) + "...";
      descCell.textContent = shortDesc;

      // Add expand indicator
      descCell.classList.add("expandable");

      // Add click handler to toggle description
      descCell.addEventListener("click", function (e) {
        if (e.target === this) {
          // Toggle between short and full description
          if (this.classList.contains("expanded")) {
            // Collapse with animation
            this.classList.add("collapsing");
            setTimeout(() => {
              this.textContent = shortDesc;
              this.classList.remove("expanded");
              this.classList.remove("collapsing");
            }, 300);
          } else {
            // Expand with animation
            this.classList.add("expanding");
            setTimeout(() => {
              this.textContent = fullDesc;
              this.classList.add("expanded");
              this.classList.remove("expanding");
            }, 300);
          }
        }
      });
    }
  });
}

/**
 * Completed task effects
 * Special animations for the completed tasks page
 */
function initCompletedTaskEffects() {
  const completedRows = document.querySelectorAll(
    ".container table tr:not(:first-child)"
  );

  // Add special styling for completed tasks
  completedRows.forEach((row, index) => {
    // Add staggered fade-in animation
    row.style.opacity = "0";
    row.style.transform = "translateY(20px)";

    setTimeout(() => {
      row.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, 100 + index * 50);

    // Add animation for "undo" button
    const undoButton = row.querySelector('a[href*="pending"] button');
    if (undoButton) {
      undoButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Add undoing animation
        row.classList.add("task-undoing");

        // Change button text
        this.innerText = "Reverting...";

        // Get the original href to redirect after animation
        const undoLink = this.closest("a").getAttribute("href");

        // Redirect after animation completes
        setTimeout(() => {
          window.location.href = undoLink;
        }, 800);
      });
    }
  });

  // Add a "check all" button
  const tableHeader = document.querySelector(".container table th:last-child");
  if (tableHeader) {
    const deleteAllButton = document.createElement("button");
    deleteAllButton.classList.add("delete-all-btn");
    deleteAllButton.innerHTML =
      'Delete All <span class="btn-tooltip">Clear completed tasks</span>';

    // Add button before the table
    const container = document.querySelector(".container");
    container.insertBefore(deleteAllButton, container.querySelector("table"));

    // Add animation and functionality
    deleteAllButton.addEventListener("click", function () {
      // Add confirmation dialog with animation
      const confirmDialog = document.createElement("div");
      confirmDialog.classList.add("confirm-dialog");
      confirmDialog.innerHTML = `
                <div class="confirm-content">
                    <h3>Delete all completed tasks?</h3>
                    <p>This action cannot be undone.</p>
                    <div class="confirm-actions">
                        <button class="confirm-cancel">Cancel</button>
                        <button class="confirm-delete">Delete All</button>
                    </div>
                </div>
            `;

      // Add dialog to the page
      document.body.appendChild(confirmDialog);

      // Animate dialog appearance
      setTimeout(() => {
        confirmDialog.classList.add("confirm-visible");
      }, 10);

      // Add button event listeners
      confirmDialog
        .querySelector(".confirm-cancel")
        .addEventListener("click", function () {
          // Fade out animation
          confirmDialog.classList.remove("confirm-visible");
          setTimeout(() => {
            confirmDialog.remove();
          }, 300);
        });

      confirmDialog
        .querySelector(".confirm-delete")
        .addEventListener("click", function () {
          // Could implement AJAX call here to delete all tasks
          // For now, just simulate deletion with animation

          // Change dialog content
          const content = confirmDialog.querySelector(".confirm-content");
          content.innerHTML = `
                    <div class="delete-progress">
                        <div class="spinner"></div>
                        <p>Deleting tasks...</p>
                    </div>
                `;

          // Animate task rows disappearing
          const rows = document.querySelectorAll(
            ".container table tr:not(:first-child)"
          );
          rows.forEach((row, index) => {
            setTimeout(() => {
              row.classList.add("task-deleting");
              setTimeout(() => {
                row.remove();
              }, 500);
            }, 100 * index);
          });

          // Close dialog after all animations
          setTimeout(() => {
            confirmDialog.classList.remove("confirm-visible");
            setTimeout(() => {
              confirmDialog.remove();

              // Show empty state message
              const table = document.querySelector(".container table");
              const emptyRow = document.createElement("tr");
              emptyRow.innerHTML =
                '<td colspan="7" style="text-align: center;">All tasks have been cleared</td>';
              table.querySelector("tbody").appendChild(emptyRow);
            }, 300);
          }, rows.length * 100 + 500);
        });
    });
  }
}
