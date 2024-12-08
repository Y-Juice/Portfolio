// Grid Background Generation with Improved Performance
const gridBackground = document.getElementById("gridBackground");
const createGrid = () => {
  gridBackground.innerHTML = "";
  const columns = Math.ceil(window.innerWidth / 50);
  const rows = Math.ceil(window.innerHeight / 50);

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.style.setProperty("--cell-index", i); // Add index for staggered animation
    fragment.appendChild(cell);
  }
  gridBackground.appendChild(fragment);
};

// Theme Toggle with Local Storage
const themeToggle = document.getElementById("themeToggle");
const theme = {
  current: localStorage.getItem("theme") || "light",
  toggle() {
    this.current = this.current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.current);
    localStorage.setItem("theme", this.current);
  },
  init() {
    document.documentElement.setAttribute("data-theme", this.current);
  },
};

theme.init();
themeToggle.addEventListener("click", () => theme.toggle());

// Responsive Grid with Debounce
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(createGrid, 250);
});

createGrid();

// Get DOM elements for project overlay
const overlay = document.getElementById("projectOverlay");
const details = document.querySelector(".project-details");
const detailTitle = document.getElementById("detailTitle");
const detailContent = document.getElementById("detailContent");

// Intersection Observer for Animation
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    observer.observe(card);
  });
};

// Initialize project click handlers
const initializeProjectHandlers = () => {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      const projectId = card.dataset.project;
      const project = window.projectDetails[projectId];

      detailTitle.textContent = project.title;
      detailContent.innerHTML = project.description;

      overlay.style.display = "flex";
      setTimeout(() => details.classList.add("active"), 10);
    });
  });
};

// Load and render projects
const loadProjects = async () => {
  try {
    const response = await fetch("./data/projects.json");
    const data = await response.json();
    const portfolioSection = document.querySelector(".portfolio");

    // Clear existing projects
    portfolioSection.innerHTML = "";

    // Add each project
    data.projects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.dataset.project = project.id;

      projectCard.innerHTML = `
        <div class="project-img" style="background: url('${project.thumbnail}')"></div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.shortDescription}</p>
        </div>
      `;

      portfolioSection.appendChild(projectCard);
    });

    // Store project details for modal
    window.projectDetails = data.projects.reduce((acc, project) => {
      acc[project.id] = {
        title: project.title,
        image: project.fullImage,
        description: `
          <div class="project-detail-image">
            <img src="${project.fullImage}" alt="${project.title}">
          </div>
          <h3>Overview</h3>
          <p>${project.longDescription}</p>
          
          <h3>Key Features</h3>
          <ul>
            ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>

          <h3>Technologies Used</h3>
          <ul>
            ${project.technologies.map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          
          <div class="project-links">
            ${
              project.demoUrl
                ? `<a href="${project.demoUrl}" target="_blank" class="demo-link">Live Demo</a>`
                : ""
            }
            ${
              project.githubUrl
                ? `<a href="${project.githubUrl}" target="_blank" class="github-link">View on GitHub</a>`
                : ""
            }
          </div>
        `,
      };
      return acc;
    }, {});

    // Reinitialize click handlers
    initializeProjectHandlers();

    // Initialize animations
    observeElements();
  } catch (error) {
    console.error("Error loading projects:", error);
  }
};

// Set up event handlers for overlay
document.querySelector(".close-button").addEventListener("click", () => {
  details.classList.remove("active");
  setTimeout(() => (overlay.style.display = "none"), 300);
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    details.classList.remove("active");
    setTimeout(() => (overlay.style.display = "none"), 300);
  }
});

// Title animation setup
const title = document.querySelector(".hero h1");
title.setAttribute("data-text", title.textContent);

title.addEventListener("mousemove", (e) => {
  const rect = title.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  title.style.setProperty("--x", `${x}%`);
  title.style.setProperty("--y", `${y}%`);
});

title.addEventListener("mouseleave", () => {
  title.style.setProperty("--x", "50%");
  title.style.setProperty("--y", "50%");
});

// Initialize projects when DOM is loaded
document.addEventListener("DOMContentLoaded", loadProjects);