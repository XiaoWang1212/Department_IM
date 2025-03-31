// slider
let slideIndex = 0;
const slidesWrapper = document.querySelector(".slides-wrapper");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;
let slideTime;

function showSlide(index) {
  if (index >= totalSlides) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = totalSlides - 1;
  } else {
    slideIndex = index;
  }

  slidesWrapper.style.transform = `translateX(-${slideIndex * 20}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === slideIndex);
  });
}

function resetTime() {
  clearInterval(slideTime);
  slideTime = setInterval(() => {
    changeSlide(1);
  }, 5000);
}

function changeSlide(n) {
  showSlide(slideIndex + n);
  resetTime();
}

function currentSlide(n) {
  showSlide(n - 1);
  resetTime();
}

resetTime();
showSlide(0);

// infoTable
function renderNewsTable() {
  const tableBody = document.getElementById("infoTableBody");
  tableBody.innerHTML = "";

  infoData.forEach((news) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${news.category}</td>
            <td><a href="#">${news.title}</a></td>
            <td>${news.attachment}</td>
            <td>${news.date}</td>
        `;
    tableBody.appendChild(row);
  });
}

// teacherCard
function renderTeacherCards() {
  const teacherGrid = document.querySelector(".teacher-grid");
  teacherGrid.innerHTML = "";

  teacherData.forEach((teacher) => {
    const card = document.createElement("div");
    card.className = "teacher-card";
    card.innerHTML = `
            <div class="card-header">
                <h3>${teacher.name}</h3>
                <div class="position-info">
                    <span class="position">${teacher.position}</span>
                    ${
                      teacher.title
                        ? `<span class="title">兼 ${teacher.title}</span>`
                        : ""
                    }
                </div>
            </div>
            <div class="card-body">
                <div class="photo">
                    <img src="${teacher.photo}" alt="${teacher.name}${
      teacher.position
    }" />
                </div>
                <div class="info">
                    <div class="info-section">
                        <h4><span class="icon">📚</span>學歷</h4>
                        <p>${teacher.education}</p>
                    </div>
                    <div class="info-section">
                        <h4><span class="icon">💡</span>專長</h4>
                        <p>${teacher.expertise}</p>
                    </div>
                    <div class="info-section">
                        <h4><span class="icon">🏆</span>獎項</h4>
                        <p>${teacher.awards}</p>
                    </div>
                    <div class="contact-info">
                        <p><span class="icon">📧</span>Email: <a href="mailto:${
                          teacher.email
                        }">${teacher.email}</a></p>
                        <p><span class="icon">🏢</span>辦公室: ${
                          teacher.office
                        }</p>
                        <p><span class="icon">📞</span>分機: ${
                          teacher.extension
                        }</p>
                        ${
                          teacher.website
                            ? `<p><span class="icon">🌐</span>個人網頁: <a href="${teacher.website}" target="_blank">前往</a></p>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
    teacherGrid.appendChild(card);
  });
}

// header .active
function setupNavLinks(containerId) {
  const links = document.querySelectorAll(
    `#${containerId} .header-container nav ul li a`
  );

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      links.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  if (links.length > 0) {
    links[0].classList.add("active");
  }
}

function setupTabLinks() {
  const tabs = document.querySelectorAll(".tabs ul li");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");
    });
  });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const selectedSection = document.getElementById(sectionId);
  selectedSection.style.display = "block";

  const navItems = document.querySelectorAll(".nav-item a");
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (
      item.getAttribute("onclick") &&
      item.getAttribute("onclick").includes(sectionId)
    ) {
      item.classList.add("active");
    }
  });

  if (sectionId === "home") {
    resetInterval();
    showSlide(0);
  }

  if (sectionId === "about") {
    const aboutLinks = document.querySelectorAll(
      "#about .header-container nav ul li a"
    );
    aboutLinks.forEach((link) => link.classList.remove("active"));
    if (aboutLinks.length > 0) {
      aboutLinks[0].classList.add("active");
    }
  }

  if (sectionId === "teacher") {
    renderTeacherCards();
  }
}

function toggleMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");

  menuToggle.addEventListener("click", function () {
    navList.classList.toggle("active");
  });

  navList.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navList.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupNavLinks("about");
  setupNavLinks("teacher");
  setupTabLinks();
  toggleMenu();

  renderNewsTable();
  showSection("home");

  const homeLink = document.querySelector('.nav-item a[onclick*="home"]');
  if (homeLink) {
    homeLink.classList.add("active");
  }
});
