import { baseUrl } from "../const.js";

async function getBrands() {
  try {
    const response = await fetch(baseUrl);

    const data = await response.json();

    return data.brands;
  } catch (error) {
    console.error("Get Brands Failed: ", error);
  }
}

export { getBrands };
