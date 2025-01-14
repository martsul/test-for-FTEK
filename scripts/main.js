const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const fieldForInformation = document.querySelector("table tbody");

function determineStatusStyle(status) {
  switch (status) {
    case "Ожидает отправки":
      return "table-warning";
    case "В пути":
      return "table-info";
    case "Доставлен":
      return "table-success";
  }
}

function getTdHtml(info) {
  const { id, name, status, origin, destination, departureDate } = info;
  const dateNow = Date.now();

  return `<th scope="row">${id}</th>
        <td>${name}</td>
        <td><select name="changeStatus" id="changeStatus">
            <option ${
              status === "Ожидает отправки" ? "selected" : ""
            } value="Ожидает отправки">Ожидает отправки</option>
            <option ${
              status === "В пути" ? "selected" : ""
            } value="В пути">В пути</option>
            <option ${dateNow < new Date(departureDate) ? "disabled" : ""} ${
    status === "Доставлен" ? "selected" : ""
  } value="Доставлен">Доставлен</option>
          </select></td>
        <td>${origin}/${destination}</td>
        <td>${departureDate}</td>`;
}

// Add started info in table

function addСargo(element) {
  const { status } = element;
  const tr = document.createElement("tr");

  tr.classList.add(determineStatusStyle(status));

  tr.innerHTML = getTdHtml(element);

  fieldForInformation.append(tr);
}

cargoList.forEach(addСargo);

// Change status in table

document.querySelector("table").addEventListener("change", (event) => {
  const targetSelect = event.target;
  const newStatus = targetSelect.value;
  const targetTr = targetSelect.parentNode.parentNode;
  const id = targetTr.querySelector("th").innerText.slice(5) - 1;
  const targetDate = new Date(cargoList[id].departureDate);
  const nowDate = Date.now();

  // Change Page
  targetTr.className = determineStatusStyle(newStatus);

  // Change Data
  cargoList[id].status = newStatus;
  tableFilter();
});

// Submit form

const form = document.querySelector("form");

// Validation

const inputs = form.querySelectorAll("input");
const selectStatus = document.querySelector("#status");

function validationForm() {
  const dateNow = Date.now();
  const dateInForm = document.querySelector("#departureDate");

  let thereAreMistakes = false;

  inputs.forEach((input) => {
    if (input.value === "") {
      input.className = "form-control is-invalid";
      thereAreMistakes = true;
    } else {
      input.className = "form-control is-valid";
    }
  });

  if (dateInForm.value !== "") {
    if (
      selectStatus.value === "Доставлен" &&
      new Date(dateInForm.value) > dateNow
    ) {
      thereAreMistakes = true;
      dateInForm.className = "form-control is-invalid";
      selectStatus.className = "form-control is-invalid";
    } else {
      dateInForm.className = "form-control is-valid";
      selectStatus.className = "form-control is-valid";
    }
  }

  return !thereAreMistakes;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validationForm()) {
    const cargoInfo = form.querySelectorAll("input, select");
    const sendingData = {};
    const id = `CARGO${String(cargoList.length + 1).padStart(3, "0")}`;

    sendingData.id = id;

    cargoInfo.forEach((element) => {
      sendingData[element.id] = element.value;
    });

    cargoList.push(sendingData);
    addСargo(sendingData);
  }
});

// Filters

const filtersFiled = document.querySelector("#filter");

filtersFiled.addEventListener("change", tableFilter);

function tableFilter() {
  const status = filtersFiled.value;
  let filteredArray = [...cargoList];

  if (status !== "Все") {
    filteredArray = filteredArray.filter(
      (element) => element.status === status
    );
  }

  fieldForInformation.innerHTML = "";
  filteredArray.forEach(addСargo);
}
