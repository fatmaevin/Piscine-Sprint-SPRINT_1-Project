// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
import { getData, addData, clearData } from "./storage.mjs";

window.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const topicForm = document.getElementById("topicForm");
  const startDateInput = document.getElementById("startDate");
  const clearAgendaBtn = document.getElementById("clearAll-Agenda");

  const users = getUserIds();

  function defaultDate() {
    if (startDateInput) {
      const today = new Date().toISOString().split("T")[0];
      startDateInput.value = today;
      startDateInput.min = today;
    }
  }
  function revisionDates(initialDate) {
    const today = new Date();
    const date = new Date(initialDate);
    const revisions = [
      { period: "1 week", days: 7 },
      { period: "1 month", months: 1 },
      { period: "3 months", months: 3 },
      { period: "6 months", months: 6 },
      { period: "1 year", years: 1 },
    ];
    return revisions
      .map((el) => {
        const nextDate = new Date(date);
        if (el.days) nextDate.setDate(nextDate.getDate() + el.days);
        if (el.months) nextDate.setMonth(nextDate.getMonth() + el.months);
        if (el.years) nextDate.setFullYear(nextDate.getFullYear() + el.years);
        return {
          period: el.period,
          date: nextDate.toISOString().split("T")[0],
        };
      })
      .filter((el) => new Date(el.date) >= today);
  }
  defaultDate();

  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", (event) => {
    const selectedUser = event.target.value;

    defaultDate();

    renderAgenda(selectedUser);
  });

  topicForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userId = userSelect.value;
    const topic = document.getElementById("topicName").value.trim();
    const date = document.getElementById("startDate").value;

    if (!userId) {
      alert("Please select user from the list");
      return;
    }
    if (!topic) {
      alert("Please enter topic");
      return;
    }

    if (!date) {
      alert("Please select start date");
      return;
    }

    addData(userId, [{ topic, date }]);
    topicForm.reset();

    defaultDate();

    renderAgenda(userId);
  });

    // clear user agenda
  clearAgendaBtn.addEventListener("click", () => {
    const userId = userSelect.value;
    if(!userId) {
      alert("Please select user first")
      return
    }

    if(confirm("Are you sure you want to delete all agendas from the list.")) {
      clearData(userId);
      renderAgenda(userId)
    }
  })

  function renderAgenda(selectedUser) {
    const agendaContainer = document.getElementById("agendaContainer");

    agendaContainer.innerHTML = "";
    if (!selectedUser) {
      agendaContainer.textContent = "No user selected";
      return;
    }
    const userAgenda = getData(selectedUser);
    if (!userAgenda || userAgenda.length === 0) {
      agendaContainer.textContent = "No topics";
    } else {
      userAgenda.sort((a, b) => new Date(a.date) - new Date(b.date));
      userAgenda.forEach((i) => {
        const p = document.createElement("p");
        p.textContent = `Topic: ${i.topic} - Date: ${i.date}`;
        agendaContainer.appendChild(p);

        const revisions = revisionDates(i.date);
        revisions.forEach((el) => {
          const revP = document.createElement("p");
          revP.textContent = `Revision: ${i.topic} - ${el.date}`;
          agendaContainer.appendChild(revP);
        });
      });
    }
  }
  renderAgenda("");
});
