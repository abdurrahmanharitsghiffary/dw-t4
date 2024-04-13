const contactForm = document.getElementById("add-project-form");
const projects = [];

const CLEAR_AFTER_SUBMIT = false;

const fieldIds = [
  "projectName",
  "startDate",
  "endDate",
  "description",
  "image",
];
const checkboxIds = ["nodejs", "nextjs", "react", "ts"];

const errorMessage = {
  empty: (key) => `${key} must not be empty.`,
  startDateHigherThanEndDate: "Start date must not be higher than end date.",
  techCheckbox: "Must be at least checked one box.",
};

// menggunakan rest params untuk gabungkan array fields n checkboxs
[...fieldIds, ...checkboxIds].forEach((field) => {
  const el = document.getElementById(field);
  const isCheckbox = el.getAttribute("type") === "checkbox";
  const onChange = (e) => {
    e.preventDefault();
    if (isCheckbox && el.checked) {
      clearErrorMessage("#technologies + .error-message");
    }
    if (el.value && !isCheckbox) {
      clearFieldError("#" + field);
      clearErrorMessage(`#${field} + .error-message`);
    }
  };

  el.addEventListener("change", onChange);
});

const onSubmit = (e) => {
  e.preventDefault();

  const data = { technologies: [] };
  let isInvalid = false;

  // lakukan perulangan pada setiap input yg bukan chechbox
  fieldIds.forEach((field) => {
    data[field] = getInputValue("#" + field);
  });

  checkboxIds.forEach((field) => {
    const isChecked = getIsChecked("#" + field);
    if (isChecked) data.technologies.push(field);
  });

  Object.entries(data).forEach(([key, value]) => {
    const isValueEmpty = value === "" || !value || value === undefined;

    if (isValueEmpty) {
      isInvalid = true;

      showErrorMessage(`#${key} + .error-message`, errorMessage.empty(key));
      showFieldError("#" + key);
    }
  });

  const isStartDateHigherThanEndDate = data.startDate > data.endDate;

  if (isStartDateHigherThanEndDate) {
    isInvalid = true;
    showErrorMessage(
      "#startDate + p.error-message",
      errorMessage.startDateHigherThanEndDate
    );
    showFieldError("#startDate");
  }

  // ketika tidak ada checkbox yg di ceklis
  if (data.technologies.length < 1) {
    isInvalid = true;
    showErrorMessage(
      "#technologies + .error-message",
      errorMessage.techCheckbox
    );
  }

  // terjadi validasi input yg tidak valid
  if (isInvalid) {
    contactForm.querySelector(".input-wrapper .error").focus();
    return;
  }

  projects.push(data);
  renderProjects();

  if (CLEAR_AFTER_SUBMIT) {
    fieldIds.forEach((field) => {
      clearInputValue("#" + field);
    });
    checkboxIds.forEach((checkboxId) => {
      document.getElementById(checkboxId).checked = false;
    });
  }
};

contactForm.addEventListener("submit", onSubmit);

const getInputValue = (selector) => {
  const el = document.querySelector(selector);

  if (el.type === "file" && el?.files?.[0]) {
    return URL.createObjectURL(el.files?.[0]);
  } else {
    return el.value;
  }
};
const getIsChecked = (selector) =>
  document.querySelector(selector).checked ? true : false;

const showFieldError = (selector) =>
  document.querySelector(selector).classList.add("error");

const clearFieldError = (selector) =>
  document.querySelector(selector).classList.remove("error");

const showErrorMessage = (selector, errorMessage) =>
  (document.querySelector(selector).innerHTML = errorMessage);

const clearInputValue = (selector) =>
  (document.querySelector(selector).value = "");

const clearErrorMessage = (selector) =>
  (document.querySelector(selector).innerHTML = "");

const renderProjects = () => {
  const el = document.getElementById("project-lists");
  el.innerHTML = "";

  if (projects.length > 0) {
    el.innerHTML = projects
      .map((project) =>
        ProjectCard({
          src: project.image,
          title: project.projectName,
          description: project.description,
          technologies: project.technologies,
          endDate: project.endDate,
          startDate: project.startDate,
        })
      )
      .join("");
  }
};

const techIcons = {
  nodejs: `<i class="fa-brands fa-node-js" style="color: #3c873a;"></i>`,
  react: `<i class="fa-brands fa-react" style="color: #61dbfb;"></i>`,
  nextjs: `<img src="./assets/img/nextjs.svg"s />`,
  ts: `<img src="./assets/img/typescript.svg" />`,
};

const ProjectCard = ({
  src,
  title,
  description,
  technologies,
  startDate,
  endDate,
}) => {
  const currentUrl = new URL(window.location.href);

  const duration = "1 Month";

  currentUrl.pathname = "/projectDetail.html";

  // menambahkan query params pada url instance
  currentUrl.searchParams.set("title", title);
  currentUrl.searchParams.set("desc", description);
  currentUrl.searchParams.set("d", duration);
  currentUrl.searchParams.set("tech", technologies.join(","));
  currentUrl.searchParams.set("img", src);
  currentUrl.searchParams.set("es-date", startDate + "," + endDate);

  return `<div class="card-project">
    <header class="card-header">
      <img
        src="${src}"
        alt="${title}"
      />
    </header>
    <div class="card-body">
    <div class="title">
    <h2>${title}</h2>
    <p>Duration: ${duration}</p>
    </div>
      <p>
        ${description}
      </p>
      <h3>Technologies</h3>
      <ul class="icon-list">
        ${technologies.map((tech) => `<li>${techIcons[tech]}</li>`).join("")}
      </ul>
      <a class="detail-link" href="${currentUrl.href}"></a>
    </div>
    <footer class="card-footer">
      <button class="button button-dark fw-bold r-sm fullwidth">
        Edit
      </button>
      <button class="button button-dark fw-bold r-sm fullwidth">
        Delete
      </button>
    </footer>
    </div>`;
};
