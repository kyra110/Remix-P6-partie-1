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
  gallery.innerHTML = "";
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
//Fonctionqui gère l'affichage de la modal du garage
function manageDisplayModalGarage(params) {
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
}
manageDisplayModalGarage();

//Affichage du garage dans la galerie
async function displayGarageModal() {
  garageModal.innerHTML = "";
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
      id = trash.id;
      const init = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      fetch("http://localhost:3000/garage/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("le delete n'a pas marché !");
          }
          return response.json();
        })
        .then((data) => {
          console.log("la delete a réussi voici la data :", data);
          displayGarageModal();
          displayVehicules();
        });
    });
  });
}
//Faire aparaitre la deuxieme modale un fois son html fini
const btnAddModal = document.querySelector(".modalGarage button");
const modalAddVehicule = document.querySelector(".modalAddVehicule");
const modalGarage = document.querySelector(".modalGarage");
const arrowleft = document.querySelector(".modalAddVehicule .fa-arrow-left");
const markAdd = document.querySelector(".modalAddVehicule .fa-xmark");

function displayAddModal() {
  btnAddModal.addEventListener("click", () => {
    modalAddVehicule.style.display = "flex";
    modalGarage.style.display = "none";
  });
  arrowleft.addEventListener("click", () => {
    modalAddVehicule.style.display = "none";
    modalGarage.style.display = "flex";
  });
  markAdd.addEventListener("click", () => {
    containerModals.style.display = "none";
    window.location = "index.html";
  });
}
displayAddModal();
// faire la prévisualisation
const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");
//Ecouter les changement sur l'input file
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});
//Faire un POST ajouter un vehicule
const form = document.querySelector("form");
const title = document.querySelector("#title");
const category = document.querySelector("#category");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    title: title.value,
    categoryId: category.value,
    category: {
      id: category.value,
      name: category.options[category.selectedIndex].text,
    },
  };
  try {
    const response = await fetch("http://localhost:3000/garage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log("Nouveau Vehicule crée !" + data);
      });
  } catch (error) {
    console.log("une erreur est survenue lors de l'envoi");
  }
});
