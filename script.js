
const jobList = document.getElementById("job-listings");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const themeToggle = document.getElementById("theme-toggle");

const modal = document.getElementById("job-modal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const applyLink = document.getElementById("applyLink");
const closeModal = document.getElementById("closeModal");

let jobs = [];

fetch("jobs.json")
  .then(res => res.json())
  .then(data => {
    jobs = data;
    populateDepartments(data);
    renderJobs(data);
  })
  .finally(() => loader.style.display = "none");

function populateDepartments(jobs) {
  const depts = [...new Set(jobs.map(j => j.department))];
  depts.forEach(dep => {
    const opt = document.createElement("option");
    opt.value = dep;
    opt.textContent = dep;
    departmentFilter.appendChild(opt);
  });
}

function renderJobs(data) {
  jobList.innerHTML = "";
  data.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Department:</strong> ${job.department}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <button class="apply-btn" data-id="${job.id}">Apply</button>
    `;
    jobList.appendChild(card);
  });

  document.querySelectorAll(".apply-btn").forEach(btn => {
    btn.onclick = () => showModal(btn.dataset.id);
  });
}

function showModal(id) {
  const job = jobs.find(j => j.id == id);
  modalTitle.textContent = job.title;
  modalDescription.textContent = job.description;
  applyLink.href = "mailto:apply@acmecorp.com?subject=Application for " + job.title;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

closeModal.onclick = () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
};

searchInput.addEventListener("input", filterJobs);
departmentFilter.addEventListener("change", filterJobs);

function filterJobs() {
  const search = searchInput.value.toLowerCase();
  const dept = departmentFilter.value;
  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search) &&
    (dept === "" || job.department === dept)
  );
  renderJobs(filtered);
}

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
};

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal.click();
});
