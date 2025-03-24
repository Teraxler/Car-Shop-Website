import { getBrands } from "./apis/brands.api.js";
import { getElementByClass } from "./modules/utils.js";

let countBrandsInFooter = 8;

function insertOurBrandsInFooter(brands, container) {
  let template = "";

  countBrandsInFooter = Math.min(countBrandsInFooter, brands.length);

  if (brands.length) {
    for (let i = 0; i < countBrandsInFooter; i++) {
      template += `
        <li>
          <a href="./pages/cars.html?brand=${brands[i].slug}"> ${brands[i].name} </a>
        </li>`;
    }
  }

  container.innerHTML = template;
}

const ourBrandsContainer = document.getElementById("our-brands-container");

window.addEventListener("load", async () => {
  const brands = await getBrands();

  insertOurBrandsInFooter(brands, ourBrandsContainer);
});

function closeMenu() {
  getElementByClass("mobile-menu").classList.remove("mobile-menu--show");
  getElementByClass("bg-overlay").classList.add("hidden");
}

const bgOverlay = getElementByClass("bg-overlay");
bgOverlay.addEventListener("click", closeMenu);

const closeMenuIcon = document.getElementById("close-menu-icon");
closeMenuIcon.addEventListener("click", closeMenu);

function openMenu() {
  getElementByClass("mobile-menu").classList.add("mobile-menu--show");
  getElementByClass("bg-overlay").classList.remove("hidden");
}

const openMenuIcon = getElementByClass("open-menu-icon");
openMenuIcon.addEventListener("click", openMenu);
