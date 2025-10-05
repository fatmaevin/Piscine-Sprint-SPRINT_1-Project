// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
window.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const users = getUserIds();
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", (event) => {
    const selectedUser = event.target.value;
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
        p.textContent = `Topic: ${i.topic}, Date:${i.date}`;
        agendaContainer.appendChild(p);
      });
    }
  });
});
