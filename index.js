// @ts-nocheck
// Vériifier que son Json server et bien enroute
/*******Variables*******/
const gallery = document.querySelector("main");

/*fonction qui retourne le tableau des works*/
async function getWorks() {
  const response = await fetch("http://localhost:3000/works");
  return await response.json();
}
getWorks();

/*Affichage des works dans le dom*/
async function affichageWorks() {
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.classList.add("galleryStyle");
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

affichageWorks();
