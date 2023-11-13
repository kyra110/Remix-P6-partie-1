// @ts-nocheck
// Vériifier que son Json server et bien enroute
/*******Variables********/
const main = document.querySelector("main");
const filters = document.querySelector(".filters");

/* fonction qui récupère le tableau des works en json*/
async function getWorks() {
  let response = await fetch("http://localhost:3000/works");
  return await response.json();
}
/* fonction qui récupère le tableau des categories en json*/
async function getCategories() {
  let response = await fetch("http://localhost:3000/categories");
  return await response.json();
}
function mainFunction() {
  affichageWorks();
  createButtons();
  btnCategory();
}
mainFunction();

//Affichage des works
async function affichageWorks() {
  const works = await getWorks();
  works.forEach((element) => {
    createWork(element);
  });
}

// Creation d'un work
function createWork(work) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const p = document.createElement("p");
  div.classList.add("galleryStyle");
  img.src = work.imageUrl;
  p.textContent = work.title;
  div.appendChild(img);
  div.appendChild(p);
  main.appendChild(div);
}
//Creation des bouttons
async function createButtons() {
  const arrayCategory = await getCategories();
  arrayCategory.forEach((element) => {
    const btn = document.createElement("button");
    btn.textContent = element.name;
    btn.id = element.id;
    filters.appendChild(btn);
  });
}
// Tri par des boutons par catégories
function btnCategory() {
  filters.addEventListener("click", async (event) => {
    const idValue = event.target.id;
    const arrayWorks = await getWorks();
    main.innerHTML = "";
    arrayWorks.forEach((work) => {
      if (idValue == work.categoryId) {
        createWork(work);
      } else if (idValue == "") {
        createWork(work);
      }
    });
  });
}
