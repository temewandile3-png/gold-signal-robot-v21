
async function loadGoldStatus() {
  const status = document.getElementById("status");

  try {
    const response = await fetch("/health");
    if (!response.ok) throw new Error("Server unavailable");

    const data = await response.json();

    if (status) {
      status.textContent = data.ok
        ? "SERVER ONLINE"
        : "SIGNAL WAIT";
    }
  } catch (error) {
    if (status) {
      status.textContent = "CONNECTION WAIT";
    }
  }
}

loadGoldStatus();
setInterval(loadGoldStatus, 30000);
