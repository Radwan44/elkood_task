const form = document.querySelector(".booking-form");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const blood = document.getElementById("blood");
const type = document.getElementById("type");
const date = document.getElementById("date");

const nameError = document.getElementById("name-error");
const phoneError = document.getElementById("phone-error");
const bloodError = document.getElementById("blood-error");
const typeError = document.getElementById("type-error");
const dateError = document.getElementById("date-error");

form.addEventListener("submit", (e) => {
  let isValid = true;

  if (!/^[A-Za-z\u0600-\u06FF\s]+$/.test(name.value.trim())) {
    nameError.textContent = "مسموح بالأحرف العربية والانكليزية فقط";
    isValid = false;
  }

  if (!/^\d{10}$/.test(phone.value.trim())) {
    phoneError.textContent = "رقم الهاتف يجب أن يتضمن 10 أرقام فقط";
    isValid = false;
  }

  if (!blood.value) {
    bloodError.textContent = "اختر زمرة الدم";
    isValid = false;
  }

  if (!type.value) {
    typeError.textContent = "اختر نوع الحجز";
    isValid = false;
  }

  if (!date.value) {
    dateError.textContent = "اجعل تاريخ حجزك في المستقبل;
    isValid = false;
  } else {
    const today = new Date().toISOString().split("T")[0];
    if (date.value < today) {
      dateError.textContent = "تاريخ الحجز لا يمكن أن يكون في الماضي";
      isValid = false;
    }
  }

  if (!isValid) {
    e.preventDefault();
  }
});
