class NotificationService {
  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.4s ease-out forwards";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

export { NotificationService };
