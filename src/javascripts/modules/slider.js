"use strict";

import {
  getAllElementsByClass,
  Timer,
} from "./utils.js";

function calcItemsPerSlide(sliderId) {
  let itemsPerSlide,
    windowWidth = window.innerWidth;

  if (sliderId === "all-vehicles-wrapper") {
    if (windowWidth >= 1280) {
      itemsPerSlide = 4;
    } else if (windowWidth >= 768) {
      itemsPerSlide = 3;
    } else if (windowWidth >= 480) {
      itemsPerSlide = 2;
    } else {
      itemsPerSlide = 1;
    }
  } else if (sliderId === "popular-makers-wrapper") {
    if (windowWidth >= 768) {
      itemsPerSlide = 2;
    } else {
      itemsPerSlide = 1;
    }
  } else if (sliderId === "comments-wrapper") {
    itemsPerSlide = 1;
  }

  return itemsPerSlide;
}

function updateSlidePosition(sliderWrapper, currentIndex) {
  let gap = 16;

  window.innerWidth >= 768 ? (gap = 30) : (gap = 16);

  sliderWrapper.style.transform = `translateX(calc(-${currentIndex * 100}% - ${
    currentIndex * gap
  }px))`;
}

function calcMaxSlides(countItems, itemsPerSlide) {
  return Math.ceil(countItems / itemsPerSlide);
}

function btnNextSliderHandler(sliderWrapper, currentIndex) {
  const countItems = sliderWrapper.dataset.countItems;
  const itemsPerSlide = calcItemsPerSlide(sliderWrapper.id);
  const maxSlides = calcMaxSlides(countItems, itemsPerSlide);

  if (currentIndex < maxSlides - 1) {
    currentIndex++;
    updateSlidePosition(sliderWrapper, currentIndex);
  } else if (currentIndex === maxSlides - 1) {
    currentIndex = 0;
    updateSlidePosition(sliderWrapper, currentIndex);
  }

  return currentIndex;
}

function btnPrevSliderHandler(sliderWrapper, currentIndex) {
  const countItems = sliderWrapper.dataset.countItems;
  const itemsPerSlide = calcItemsPerSlide(sliderWrapper.id);
  const maxSlides = calcMaxSlides(countItems, itemsPerSlide);

  if (currentIndex > 0) {
    currentIndex--;
    updateSlidePosition(sliderWrapper, currentIndex);
  } else if (currentIndex === 0) {
    currentIndex = maxSlides - 1;
    updateSlidePosition(sliderWrapper, currentIndex);
  }

  return currentIndex;
}

function renderSliders() {
  const sliderContainers = getAllElementsByClass("slider");

  for (const slider of sliderContainers) {
    let sliderWrapper,
      btnNext,
      btnPrev,
      interval,
      currentIndex = 0;

    sliderWrapper = slider.getElementsByClassName("slider__wrapper")[0];

    btnNext = slider.getElementsByClassName("btn-next")[0];
    btnPrev = slider.getElementsByClassName("btn-prev")[0];

    interval = new Timer(() => {
      currentIndex = btnNextSliderHandler(sliderWrapper, currentIndex);
    }, 5000);

    // Btn next
    btnNext.addEventListener("click", () => {
      console.log(interval);
      interval.reset(() => {
        currentIndex = btnNextSliderHandler(sliderWrapper, currentIndex);
      }, 5000);

      currentIndex = btnNextSliderHandler(sliderWrapper, currentIndex);
    });

    // Btn prev
    btnPrev.addEventListener("click", () => {
      interval.reset(() => {
        currentIndex = btnNextSliderHandler(sliderWrapper, currentIndex);
      }, 5000);

      currentIndex = btnPrevSliderHandler(sliderWrapper, currentIndex);
    });
  }
}

export { renderSliders };
