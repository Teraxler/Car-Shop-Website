"use strict";

import { getBlogs } from "../apis/blogs.api.js";
import { getBrands } from "../apis/brands.api.js";
import { getCars } from "../apis/cars.api.js";
import { getUsers } from "../apis/users.api.js";
import { renderSliders } from "../modules/slider.js";
import {
  filterPopularCars,
  findBrandByName,
  generateStarRatingClasses,
  getAllElementsByClass,
  normalizeDateTime,
  removeClass,
} from "../modules/utils.js";

const MAX_BRANDS_COUNT = 6;
const MAX_SWIPER_ITEMS = 12;
const MAX_BRANDS = 30;

function toggleBookmarkIcon(event) {
  event.preventDefault();
  let useElement = event.currentTarget.children[0].children[0];

  if (useElement.getAttribute("href") === "#bookmark") {
    useElement.setAttribute("href", "#bookmark-solid");
  } else {
    useElement.setAttribute("href", "#bookmark");
  }
}

function setClickEventOnBookmarks() {
  const bookmarks = getAllElementsByClass("bookmark");

  bookmarks.forEach((bookmark) => {
    bookmark.addEventListener("click", toggleBookmarkIcon);
  });
}

function selectDropDownItem(event) {
  let label,
    target = event.target;

  if (target.tagName === "LI") {
    label =
      event.target.parentElement.previousElementSibling.previousElementSibling;

    label.textContent = event.target.textContent;
    label.dataset.value = event.target.dataset.value;

    label.click();
  }
}

function redirectPage() {
  const labelMaker = document.getElementById("label-maker");
  const labelPrice = document.getElementById("label-price");
  const labelModel = document.getElementById("label-model");

  const carConditionElm =
    document.getElementsByClassName("car-status--active")[0];

  let price, model, brand, condition;

  brand = labelMaker.dataset.value.toLowerCase();
  model = labelModel.dataset.value.toLowerCase();
  price = labelPrice.dataset.value.toLowerCase();
  condition = carConditionElm?.textContent.toLowerCase() ?? "all";

  location.replace(
    `./pages/cars.html?brand=${brand}&model=${model}&price-range=${price}${
      condition !== "all" ? `&condition=${condition}` : ""
    }`
  );
}

function renderPermiumBrands(brands) {
  let template = "";

  for (let i = 0; i < MAX_BRANDS_COUNT; i++) {
    const { name, slug, logo } = brands[i];

    template += `
      <a href="./pages/cars.html?brand=${slug}"
        class="bg-white text-center border py-4 xl:py-6.5 border-gray-200 rounded-2xl"
      >
        <div class="flex items-center justify-center max-w-full size-25 px-2 sm:px-0 mx-auto">
          <img class="max-h-full"
            src="./assets/${logo}"
            alt="${slug} logo"/>
        </div>
        <span class="block mt-1.5">${name}</span>
      </a>`;
  }

  document.getElementById("permium-brands-wrappper").innerHTML = template;
}

function changeDisplayedCarsByCondition(event) {
  console.log(event);
}

const allVehiclesConditionElements = document.getElementsByClassName(
  "all-vehicles__condition"
);

[...allVehiclesConditionElements].forEach((conditionElement) => {
  conditionElement.addEventListener("click", changeDisplayedCarsByCondition);
});

function renderAllVeihcles(cars) {
  const Container = document.getElementById("all-vehicles-wrapper");

  Container.dataset.countItems = Math.min(cars.length, MAX_SWIPER_ITEMS);

  Container.innerHTML = cars
    .slice(0, MAX_SWIPER_ITEMS)
    .map(
      ({
        _id,
        engine,
        year,
        price,
        images,
        model,
        topSpeed,
        fuelType,
        transmission,
        manufacturer,
      }) => `
          <div class="flex justify-center w-full xs:w-[calc(50%-8.034px)] md:w-[calc(33.333333%-20.067px)] xl:w-[calc(25%-22.534px)] shrink-0">
            <div class="w-full max-w-80 xs:max-w-full shrink-0 rounded-2xl overflow-hidden">
            <div class="block relative">
                <img class="w-full h-46 object-cover"
                  src="./assets/${images[0].path}"
                  alt="${manufacturer} ${model} – ${year}"/>
                <span
                  class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-green-600 text-white text-xs lg:text-parent w-20 lg:w-[105px] h-6 lg:h-7.5 rounded-full"
                  >Great Price</span>
                <div
                  class="bookmark absolute top-2 lg:top-5 right-2 lg:right-5 size-8 lg:size-9 flex items-center justify-center bg-white text-primary cursor-pointer rounded-full"
                  data-car-id=${_id}>
                    <svg class="size-4">
                      <use href="#bookmark"></use>
                    </svg>
                </div>
              </div>
              <div
                class="px-4 lg:px-7.5 pb-4 lg:pb-7.5 pt-3 lg:pt-4 border-x border-b border-gray-200 rounded-b-2xl">
                <h4
                  class="line-clamp-1 mb-1 lg:mb-1.5 text-base lg:text-lg/[22px] font-medium">
                  ${manufacturer} ${model} – ${year}
                </h4>
                <span
                  class="line-clamp-1 mb-1 text-xs lg:text-sm/[17px]">
                    ${engine.size.toFixed(1)}${engine.unit} 
                    ${engine.type}
                </span>
                <div
                  class="flex justify-between py-3 lg:py-4 border-y border-gray-200 text-center text-xs lg:text-sm/none">
                  <div class="">
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#max-speed"></use>
                    </svg>
                    <span>${topSpeed.value} ${topSpeed.unit}</span>
                  </div>
                  <div>
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#gas"></use>
                    </svg>
                    <span>${fuelType}</span>
                  </div>
                  <div>
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#gear"></use>
                    </svg>
                    <span>${transmission}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-3 lg:mt-4">
                  ${
                    price.original > price.discounted
                      ? `
                      <div class="flex flex-col">
                        <span class="font-bold text-base lg:text-md line-through">
                          $${price.original.toLocaleString()}
                        </span>
                        <span class="font-bold text-base lg:text-xl/[30px]">
                          $${price.discounted.toLocaleString()}
                        </span>
                      </div>
                        `
                      : `<span class="font-bold text-base lg:text-xl/[30px]">
                    $${price.original.toLocaleString()}
                  </span>`
                  }
                  <a href="./pages/car-details.html?id=${_id}"
                    class="flex items-center gap-x-1.5 lg:gap-x-2.5 mt-2.5 sm:mt-0 text-xs lg:text-parent text-secondary font-medium">
                      View Details
                      <svg class="w-3 lg:w-3.5 h-3 lg:h-3.5">
                        <use href="#arrow-up-right"></use>
                      </svg>
                  </a>
                </div>
              </div>
              </div>
            </div>`
    )
    .join("");
}

function renderCarBrandsOfSearchBox(brands) {
  const carsMenuContainer = document.getElementById("brands-list");

  carsMenuContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      renderCarModels(brands, e.target.textContent.trim());
    }
  });

  for (const brand of brands) {
    carsMenuContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="drop-down__list-item"
        data-value="${brand.slug}">
          ${brand.name}
      </li>`
    );
  }
}

function renderCarModels(brands, brandName) {
  const modelsList = document.getElementById("models-list");
  const choisenBrand = findBrandByName(brands, brandName);

  let label = modelsList.previousElementSibling;
  label.textContent = "Any Models"; // Default Value

  let template = `<li class="px-2 md:px-2.5 md:py-px line-clamp-1 hover:bg-secondary hover:text-white transition-colors cursor-pointer rounded-md" data-value="Any-Models">Any Models</li>`;

  choisenBrand?.models.forEach((model) => {
    template += `
      <li
        class="px-2 md:px-2.5 md:py-px line-clamp-1 hover:bg-secondary hover:text-white transition-colors cursor-pointer rounded-md"
        data-value="${model.slug}">
        ${model.name}
      </li>
      `;
  });

  modelsList.innerHTML = template;
}

function renderPopularMakers(popularCars) {
  let countItems = 0,
    contentContainer;

  contentContainer = document.getElementById("popular-makers-wrapper");

  for (const car of popularCars) {
    if (countItems < MAX_SWIPER_ITEMS) {
      const {
        _id,
        year,
        model,
        price,
        images,
        engine,
        fuelType,
        topSpeed,
        manufacturer,
        transmission,
      } = car;

      countItems++;

      contentContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="w-full md:w-[calc(50%-15px)] flex justify-center shrink-0 "> 
          <div class="w-full max-w-80 xs:max-w-[566px] lg:max-w-3xl flex flex-col xs:flex-row rounded-2xl overflow-hidden">
          <div class="relative shrink-0 xs:w-[46%]">
            <img
              class="w-full h-full"
              src="./assets/${images[0].path}"
              alt="${images[0].alt}"/>
            <span
              class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-green-600 text-white text-xs lg:text-parent px-2.5 lg:px-[15px] h-6 lg:h-7.5 rounded-full">Great Price</span>
            <div
              class="absolute top-2 lg:top-5 right-2 lg:right-5 size-8 lg:size-9 flex items-center justify-center bg-white text-primary cursor-pointer rounded-full">
              <svg class="size-4">
                <use href="#bookmark"></use>
              </svg>
            </div>
          </div>
          <div class="flex-grow p-3 lg:px-4 xl:px-7.5 lg:pb-[22px] lg:pt-5 bg-white/[7%]">
            <h4
              class="line-clamp-1 mb-1 lg:mb-1.5 text-base lg:text-lg/[22px] font-medium">
              ${manufacturer} ${model} - ${year}
            </h4>
            <span class="line-clamp-1 text-xs lg:text-sm/none">
              ${engine.size}${engine.unit} ${engine.type}
            </span>
            <div
              class="flex flex-col items-start gap-y-2.5 xl:gap-y-[15px] py-3 lg:py-4 xl:py-6.5 text-xs lg:text-sm/none">
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#max-speed"></use>
                </svg>
                <span>${topSpeed.value} ${topSpeed.unit}</span>
              </div>
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#gas"></use>
                </svg>
                <span>${fuelType}</span>
              </div>
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#gear"></use>
                </svg>
                <span>${transmission}</span>
              </div>
            </div>
            <div class="flex items-end justify-between">
              ${
                price.original > price.discounted
                  ? `
                <div class="flex flex-col">
                  <span class="line-through text-xs lg:text-sm">$${price.original.toLocaleString()}</span>
                  <span class="font-bold lg:text-xl/[30px]">$${price.discounted.toLocaleString()}</span>
                </div>
                `
                  : `<span class="font-bold lg:text-xl/[30px]">$${price.discounted.toLocaleString()}</span>`
              }
              <a
                href="./pages/car-details.html?id=${_id}"
                class="flex items-center gap-x-1.5 lg:gap-x-2.5 mt-2.5 sm:mt-0 text-xs lg:text-parent font-medium">
                View Details
                <svg class="w-3 lg:w-3.5 h-3 lg:h-3.5">
                  <use href="#arrow-up-right"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
        </div>`
      );
    }
  }

  contentContainer.dataset.countItems = countItems;
}

function renderUserComments(customers) {
  const commentsWrapper = document.getElementById("comments-wrapper");

  let svgsColorClass,
    countComments = 0;

  for (const customer of customers) {
    if (customer.score >= 4 && countComments < 8) {
      const { name, score, comment, profileImg, job } = customer;
      countComments++;

      svgsColorClass = generateStarRatingClasses(score);

      commentsWrapper.insertAdjacentHTML(
        "beforeend",
        `<div
            class="shrink-0 w-full flex flex-col sm:flex-row gap-6 lg:gap-x-12 xl:gap-x-16 2xl:gap-x-[150px] ">
            <!-- Prfile img -->
            <div
              class="w-48 lg:w-72 xl:w-96 2xl:w-[448px] aspect-square mx-auto shrink-0 rounded-lg overflow-hidden">
              <img src="./assets/${profileImg}" alt="Profile img ${name}" />
            </div>
            <!-- Descriptions -->
            <div class="flex flex-col justify-center">
              <!-- Head -->
              <div class="flex flex-col items-center sm:items-start">
                <!-- Score -->
                <div class="flex items-center gap-x-2.5">
                  <div class="flex gap-x-0.5">
                    <svg class="size-4 ${svgsColorClass[0]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgsColorClass[1]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgsColorClass[2]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgsColorClass[3]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgsColorClass[4]}">
                      <use href="#star"></use>
                    </svg>
                  </div>
                  <span
                    class="px-2 lg:px-2.5 text-xs lg:text-parent text-white bg-[#E1C03F] rounded-full">
                      ${score.toFixed(1)}
                    </span>
                </div>
                <span class="lg:text-lg/[21.6px] font-medium mt-2.5 lg:mt-3.5">
                  ${name}
                </span>
                <span class="mt-1 text-sm lg:text-parent">${job}</span>
              </div>
              <p 
              class="sm:text-lg/8 lg:text-2xl/9 2xl:text-[26px]/[48px] line-clamp-5 sm:line-clamp-4 text-center sm:text-start font-medium mt-4 lg:mt-[35px]">
                ${comment}
              </p>
            </div>
            </div>`
      );
    }
  }

  commentsWrapper.dataset.countItems = countComments;
}

function renderCarBrands(brands) {
  const carBrandsWrapper = document.getElementById("car-brands-wrapper");

  carBrandsWrapper.innerHTML = brands
    .slice(0, MAX_BRANDS)
    .map(
      (brand) => `
      <li>
        <a href="./pages/cars.html?brand=${brand.slug}"> ${brand.name} Cars </a>
      </li>`
    )
    .join("");
}

function renderBlogs(blogs) {
  const blogsWrapper = document.getElementById("blogs-wrapper");

  for (const blog of blogs) {
    const { slug, tags, author, createdAt, title, cover } = blog;

    const { year, monthName, day } = normalizeDateTime(createdAt);

    blogsWrapper.insertAdjacentHTML(
      "beforeend",
      `
      <div class="max-w-80 xs:max-w-full">
        <a href="./pages/blog.html?blog=${slug}" class="relative rounded-2xl overflow-hidden">
          <img
            class="w-full aspect-[3/2] rounded-2xl"
            src="./assets/${cover.path}"
            alt="${cover.alt}"/>
          <span
            class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-white text-primary text-xs lg:text-parent px-2.5 lg:px-[15px] h-6 lg:h-7.5 rounded-full">
              ${tags[0]}
            </span>
        </a>
        <div
          class="flex gap-x-3 md:gap-x-3.5 mt-2.5 md:mt-5 mb-0.5 md:mb-1">
          <div class="flex items-center gap-x-2 md:gap-x-2.5">
            <span class="text-xs sm:text-parent"> ${author.name} </span>
            <span class="size-1 bg-gray-300 rounded-full"></span>
          </div>
          <span class="text-xs sm:text-parent">${monthName} ${day}, ${year}</span>
        </div>
        <p
          class="text-base sm:text-lg xl:text-xl/[30px] line-clamp-2 font-medium">
          ${title}
        </p>
      </div>
      `
    );
  }
}

async function init() {
  try {
    const cars = await getCars();
    const brands = await getBrands();
    const blogs = await getBlogs();
    const users = await getUsers();

    const popularCars = filterPopularCars(cars);

    renderCarBrandsOfSearchBox(brands);
    renderPermiumBrands(brands);
    renderAllVeihcles(cars);
    renderPopularMakers(popularCars);
    renderUserComments(users);
    renderCarBrands(brands);
    renderBlogs(blogs);

    setClickEventOnBookmarks();

    renderSliders();
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

window.addEventListener("DOMContentLoaded", init);

document.body.addEventListener("click", (event) => {
  if (!event.target.className?.includes("drop-down__label")) {
    removeClass("drop-down__list-item--active");
  }
});

const dropDownListItems = getAllElementsByClass("drop-down__list");

for (const list of dropDownListItems) {
  list.addEventListener("click", selectDropDownItem);
}

const carStatusBtn = getAllElementsByClass("car-status");

for (const btn of carStatusBtn) {
  btn.addEventListener("click", (e) => {
    let element = e.target;

    removeClass("car-status--active");

    element.classList.add("car-status--active");
  });
}

const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", redirectPage);
