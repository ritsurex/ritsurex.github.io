// --- CONFIGURATION ---
// 1. Sign up on emailjs.com (free tier works)
// 2. Add an Email Service (e.g., Gmail/Outlook)
// 3. Create an Email Template with variables: {{from_name}}, {{reply_to}}, {{message}}
// 4. Fill in these three constants:
const EMAILJS_PUBLIC_KEY = "W85Mz4cYXG0CVONev";
const EMAILJS_SERVICE_ID = "service_4t6a12q";
const EMAILJS_TEMPLATE_ID = "template_1lemu7n";

// Initialize EmailJS
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }
})();

// Scroll Reveal Animations via IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Trigger once
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Bitcoin Address Copy Handler
  const copyBtn = document.getElementById("copy-btc-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const address = "bc1qnzhgd35e633x6sv9fflmu53jyntzzu4wnr2g7s";
      try {
        await navigator.clipboard.writeText(address);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  }

  // Client-Side Email Submission Handler
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Guard check for placeholder credentials
      if (EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
        status.style.color = "#ff5555";
        status.textContent = "Error: Configure your EmailJS keys in script.js";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Transmitting...";
      status.textContent = "";

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(() => {
          status.style.color = "#00e599";
          status.textContent = "Message transmitted successfully.";
          form.reset();
        })
        .catch((error) => {
          status.style.color = "#ff5555";
          status.textContent = "Failed to transmit message. Please retry.";
          console.error("EmailJS Error:", error);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        });
    });
  }
});
