const url = new URL(window.location.href);

const techIcons = {
  nodejs: {
    label: "Node JS",
    icon: `<i class="fa-brands fa-node-js" style="color: #3c873a;"></i>`,
  },
  react: {
    label: "React JS",
    icon: `<i class="fa-brands fa-react" style="color: #61dbfb;"></i>`,
  },
  nextjs: { label: "Next JS", icon: `<img src="./assets/img/nextjs.svg" />` },
  ts: {
    label: "Typescript",
    icon: `<img src="./assets/img/typescript.svg" />`,
  },
};

const title = url.searchParams.get("title");
const description = url.searchParams.get("desc");
const tech = url.searchParams.get("tech");
const d = url.searchParams.get("d");
const img = url.searchParams.get("img");
const esDate = url.searchParams.get("es-date").split(",");
const startDate = new Date(esDate[0]);
const endDate = new Date(esDate[1]);

// Value dari slh satu q params undef === redirect
if (!title || !description || !tech || !d || !img) {
  url.pathname = "/myProject.html";
  window.location.href = url.href;
}

const h1 = document.querySelector(".container h1");
const p = document.querySelector(".content p");
const techList = document.querySelector(".tech-lists");
const duration = document.querySelector("#duration");
const projectImage = document.querySelector(".header img");

h1.innerHTML = title;
p.innerHTML = description;
duration.children.item(1).innerHTML = `<i class="fa-regular fa-calendar"></i>
<p>${startDate.toDateString()} - ${endDate.toDateString()}</p>`;
duration.children.item(2).innerHTML = `<i class="fa-regular fa-clock"></i>
<p>Duration: ${d}</p>`;
projectImage.setAttribute("src", img);
projectImage.setAttribute("alt", title);
techList.innerHTML = tech
  .split(",")
  .map(
    (t) => `<li>
${techIcons[t].icon}
<p>${techIcons[t].label}</p>
</li>`
  )
  .join("");
