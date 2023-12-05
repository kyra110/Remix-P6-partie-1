// @ts-nocheck
// Vériifier que son Json server et bien enroute
/*******Variables*******/
const gallery = document.querySelector("main");
const filters = document.querySelector(".filters");

/*fonction qui retourne le tableau des vehicules*/
async function getVehicules() {
  const response = await fetch("http://localhost:3000/garage");
  return await response.json();
}
getVehicules();

/*Affichage des works dans le dom*/
async function displayVehicules() {
  const vehicules = await getVehicules();
  vehicules.forEach((vehicule) => {
    createVehicules(vehicule);
  });
}
displayVehicules();

function createVehicules(vehicule) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = vehicule.imageUrl;
  figcaption.textContent = vehicule.title;
  figure.classList.add("galleryStyle");
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}
//***************Affichage des boutons par catégories*************/

//récupérer le tableau des catégories

async function getCategorys() {
  const response = await fetch("http://localhost:3000/categories");
  return await response.json();
}

async function displayCategorysButtons() {
  const categorys = await getCategorys();
  console.log(categorys);
  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name.toUpperCase();
    btn.id = category.id;
    filters.appendChild(btn);
  });
}
displayCategorysButtons();

// filtrer au click sur le bouton par catégorie

async function filterCategoy() {
  const garage = await getVehicules();
  console.log(garage);
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const garageTriCategory = garage.filter((vehicule) => {
          return vehicule.categoryId == btnId;
        });
        garageTriCategory.forEach((vehicule) => {
          createVehicules(vehicule);
        });
      } else {
        displayVehicules();
      }
      console.log(btnId);
    });
  });
}
filterCategoy();

// ******************* Si l'utilisateur et conecté ***********************

const loged = window.sessionStorage.loged;
const admin = document.querySelector("header nav .admin");
const logout = document.querySelector("header nav .logout");

if (loged == "true") {
  admin.textContent = "Admin";
  logout.textContent = "logout";
  logout.addEventListener("click", () => {
    window.sessionStorage.loged = false;
  });
}

//Au click sur Admin affichage des modales suite P6-p3
const containerModals = document.querySelector(".containerModals");
const mark = document.querySelector(".fa-xmark");
const garageModal = document.querySelector(".garageModal");

admin.addEventListener("click", () => {
  // console.log(containerModals);
  containerModals.style.display = "flex";
});
// gere la fermeture de la modale sur la croix
mark.addEventListener("click", () => {
  containerModals.style.display = "none";
});
//gere la fermeture sur le container en dehor du garage
containerModals.addEventListener("click", (e) => {
  // console.log(e.target.className);
  if (e.target.className == "containerModals") {
    containerModals.style.display = "none";
  }
});
//Affichage du garage dans la galerie
async function displayGarageModal() {
  const garage = await getVehicules();
  garage.forEach((vehicule) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    span.id = vehicule.id;
    img.src = vehicule.imageUrl;
    figure.appendChild(img);
    figure.appendChild(span);
    garageModal.appendChild(figure);
  });
  deleteVehicule();
}
displayGarageModal();

//supréssion d'une image dans la modal
function deleteVehicule() {
  const trashAll = document.querySelectorAll(".garageModal span");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      console.log(trash.id);
    });
  });
}
