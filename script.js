const calendarGrid = document.querySelector(".calendar-grid");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

const monthNames = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
  // Takvim gövdesini temizle (ilk 7 eleman gün adları zaten)
  calendarGrid.querySelectorAll(".day-cell").forEach(cell => cell.remove());

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Pazar
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Takvim başlangıç boşlukları (Pzt=0 için kaydırma)
  const startIndex = (firstDay + 6) % 7;

  // Ay başlığı
  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Hücreleri oluştur
  for (let i = 0; i < startIndex + daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (i >= startIndex) {
      const day = i - startIndex + 1;
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const dayNumber = document.createElement("div");
      dayNumber.className = "day-number";
      dayNumber.textContent = day;
      cell.appendChild(dayNumber);

      // Görev listesi
      const ul = document.createElement("ul");
      ul.className = "task-list";
      const tasks = JSON.parse(localStorage.getItem(dateKey)) || [];
      tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.done) span.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
          tasks[index].done = checkbox.checked;
          localStorage.setItem(dateKey, JSON.stringify(tasks));
          renderCalendar(currentMonth, currentYear);
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "×";
        delBtn.className = "delete-task-btn";
        delBtn.addEventListener("click", () => {
          tasks.splice(index, 1);
          localStorage.setItem(dateKey, JSON.stringify(tasks));
          renderCalendar(currentMonth, currentYear);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        ul.appendChild(li);
      });
      cell.appendChild(ul);

      // Görev ekleme alanı
      const inputArea = document.createElement("div");
      inputArea.className = "task-input-area";

      const input = document.createElement("input");
      input.placeholder = "Ekle...";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          button.click();
        }
      });

      const button = document.createElement("button");
      button.innerHTML = '<i class="fa fa-plus"></i>';

      button.addEventListener("click", () => {
        const text = input.value.trim();
        if (text) {
          tasks.push({ text: text, done: false });
          localStorage.setItem(dateKey, JSON.stringify(tasks));
          renderCalendar(currentMonth, currentYear);
        }
      });

      inputArea.appendChild(input);
      inputArea.appendChild(button);
      cell.appendChild(inputArea);
    }

    calendarGrid.appendChild(cell);
  }
}

prevMonthBtn.addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);
s