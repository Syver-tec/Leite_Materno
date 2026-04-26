// ===============================
// Modal
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const btn = document.getElementById("openCard");
  const span = document.querySelector(".close");

  if (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
    });
  }

  if (span) {
    span.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});