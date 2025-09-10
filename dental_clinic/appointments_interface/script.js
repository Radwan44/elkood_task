const waitingPatients = document.getElementById("waitingPatients");
const upcomingPatients = document.getElementById("upcomingPatients");
const currentBox = document.getElementById("current-Box");
const dropZones = Array.from(document.getElementsByClassName("drop-zone"));

let draggedCard = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const modal = document.getElementById("patientModal");
const modalName = document.getElementById("modalTitle");
const modalBlood = document.getElementById("modalBlood");
const modalDate = document.getElementById("modalDate");
const modalType = document.getElementById("modalType");
const modalPhone = document.getElementById("modalPhone");
const modalCloseBtn = modal.querySelector(".modal-close");
const modalBackdrop = modal.querySelector(".modal-backdrop");
const deletePatientBtn = document.getElementById("deletePatient");

fetch("patients.json")
  .then((res) => res.json())
  .then((data) => {
    data.map((record) => {
      const smallCard = UISmallCard(record);
      if (
        record.appointmentType === "مباشر" ||
        record.appointmentType === "حالة إسعافية"
      ) {
        waitingPatients.appendChild(smallCard);
      }
      if (record.appointmentType === "مسبق") {
        upcomingPatients.appendChild(smallCard);
      }
    });
  });

function UISmallCard(record) {
  const smallCard = document.createElement("div");
  const appointmentType = document.createElement("span");
  const name = document.createElement("span");
  const patientInfo = document.createElement("div");

  // adding classes and attributes
  smallCard.classList.add(
    "appointment",
    "animate__animated",
    "animate__zoomIn"
  );
  patientInfo.className = "patient-info";

  if (record.appointmentType === "مسبق") {
    appointmentType.classList.add("appointmentType", "appointment-scheduled");
  }
  if (record.appointmentType === "مباشر") {
    appointmentType.classList.add("appointmentType", "appointment-walkin");
  }
  if (record.appointmentType === "حالة إسعافية") {
    appointmentType.classList.add("appointmentType", "appointment-emergency");
  }

  name.innerText = record.name;
  appointmentType.innerText = record.appointmentType;

  patientInfo.appendChild(name);
  patientInfo.appendChild(appointmentType);
  smallCard.appendChild(patientInfo);

  dragAndDrop(smallCard);

  smallCard.addEventListener("click", (e) => {
    if (isDragging) return;
    openModal(record, smallCard);
  });

  return smallCard;
}

function dragAndDrop(card) {
  card.setAttribute("draggable", "true");

  card.addEventListener("dragstart", () => {
    draggedCard = card;
    isDragging = true;
  });

  card.addEventListener("dragend", () => {
    draggedCard = null;

    setTimeout(() => (isDragging = false), 150);
  });

  dropZones.forEach((dropZone) => {
    dropZone.addEventListener("dragover", (e) => {
      if (draggedCard.parentElement !== dropZone) {
        e.preventDefault();
      }
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();

      dropZone.appendChild(draggedCard);

      if (
        currentBox.contains(draggedCard) &&
        currentBox.contains(currentBox.querySelector("#emptyFiled"))
      ) {
        currentBox.querySelector("#emptyFiled").innerText = "";
      } else {
        currentBox.querySelector("#emptyFiled").innerText = "لا يوجد مريض حالي";
      }
    });
  });

  // drag and drop emulator for touch screens
  card.addEventListener("touchstart", handleTouchStart, { passive: false });
  card.addEventListener("touchmove", handleTouchMove, { passive: false });
  card.addEventListener("touchend", handleTouchEnd, { passive: false });

  function handleTouchStart(e) {
    draggedCard = e.target.closest(".appointment");
    parentDraggedCard = draggedCard.parentNode;

    const touch = e.touches[0];

    const rect = draggedCard.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    /* without this, when clicking the card it will become absolute and its position will change before showing the big card for milliseconds */
    setTimeout(() => {
      if (draggedCard) draggedCard.style.position = "absolute";
    }, 200);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = draggedCard.getBoundingClientRect();

    // Although this successfully matches the card movement with the cursor, I don't understand the logical reasoning behind it. I arrived at this solution purely through trial and error and estimation.
    draggedCard.style.left = touch.clientX - offsetX - rect.width + "px";
    draggedCard.style.top =
      touch.clientY - offsetY - rect.width / 2 - rect.height / 2 + "px";
  }

  function handleTouchEnd(e) {
    dropZones.forEach((zone) => {
      const rect = zone.getBoundingClientRect();
      const touch = e.changedTouches[0];

      draggedCard.style.position = "static"; //this also is useful in case drop failed, the card will return on its original place
      if (
        zone !== parentDraggedCard &&
        touch.clientX > rect.left &&
        touch.clientX < rect.right &&
        touch.clientY > rect.top &&
        touch.clientY < rect.bottom
      ) {
        zone.appendChild(draggedCard);
      }
    });

    if (
      currentBox.contains(draggedCard) &&
      currentBox.contains(currentBox.querySelector("#emptyFiled"))
    ) {
      currentBox.querySelector("#emptyFiled").innerText = "";
    } else {
      currentBox.querySelector("#emptyFiled").innerText = "لا يوجد مريض حالي";
    }

    draggedCard = null;
  }
}

let currentSmallCard = null;
function openModal(record, smallCard) {
  currentSmallCard = smallCard;

  modalName.innerText = record.name;
  modalBlood.innerText = record.bloodType;
  modalDate.innerText = record.appointmentDate;
  modalType.innerText = record.appointmentType;
  modalPhone.innerText = record.phone;

  modal.classList.add("open", "animate__animated", "animate__fadeInDown");
  document.body.classList.add("modal-open");

  deletePatientBtn.addEventListener("click", () => {
    if (currentSmallCard && currentSmallCard.parentElement) {
      currentSmallCard.parentElement.removeChild(currentSmallCard);
    }

    closeModal();
  });
}

function closeModal() {
  modal.classList.remove("open");

  document.body.classList.remove("modal-open");

  modal.addEventListener(
    "animationend",
    () => {
      modal.classList.remove("animate__animated", "animate__fadeInDown");
    },
    { once: true }
  );
}

modalCloseBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
