"use strict";

const DATA_URL = "internships.json";

const cardsEl = document.getElementById("cards");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("search");
const domainEl = document.getElementById("domain");
const resetEl = document.getElementById("reset");

let internships = [];

/* Safely escape text before putting it in HTML */
function esc(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

/* Load data, with error state */
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    // Seed file wraps the list as { "internships": [...] }; also accept a plain array
    const list = Array.isArray(data) ? data : data.internships;
    if (!Array.isArray(list)) throw new Error("Invalid data format");
    internships = list;
    fillDomains();
    render();
  } catch (err) {
    console.error(err);
    cardsEl.innerHTML = "";
    setStatus("Internships could not be loaded. Check your connection and refresh the page.", true);
  }
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function fillDomains() {
  const domains = [...new Set(internships.map(i => i.domain).filter(Boolean))].sort();
  domains.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    domainEl.appendChild(opt);
  });
}

/* Reusable card builder */
function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("aria-label", `${item.title}, ${item.domain}, ${item.mode}`);

  const skills = Array.isArray(item.skills) ? item.skills : [];
  const openings = Number(item.openings) || 0;
  card.innerHTML = `
    <h2>${esc(item.title)}</h2>
    <p class="company">${esc(item.domain)}</p>
    <ul class="meta">
      <li><strong>ID:</strong> ${esc(item.id)}</li>
      <li><strong>Mode:</strong> ${esc(item.mode)}</li>
      <li><strong>Location:</strong> ${esc(item.location)}</li>
      <li><strong>Openings:</strong> ${openings}</li>
    </ul>
    <ul class="tags" aria-label="Skills">
      ${skills.map(s => `<li>${esc(s)}</li>`).join("")}
    </ul>`;
  return card;
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const domain = domainEl.value;

  const filtered = internships.filter(i => {
    const text = [i.title, i.id, i.domain, i.mode, i.location, ...(Array.isArray(i.skills) ? i.skills : [])]
      .join(" ").toLowerCase();
    return text.includes(query) && (domain === "all" || i.domain === domain);
  });

  cardsEl.innerHTML = "";

  if (filtered.length === 0) {
    setStatus("No internships match your search. Try a different word or choose All domains.");
    return;
  }

  setStatus(`${filtered.length} internship${filtered.length === 1 ? "" : "s"} found`);
  const frag = document.createDocumentFragment();
  filtered.forEach(i => frag.appendChild(createCard(i)));
  cardsEl.appendChild(frag);
}

searchEl.addEventListener("input", render);
domainEl.addEventListener("change", render);
document.getElementById("filters").addEventListener("submit", e => e.preventDefault());
resetEl.addEventListener("click", () => {
  searchEl.value = "";
  domainEl.value = "all";
  render();
  searchEl.focus();
});

loadData();
