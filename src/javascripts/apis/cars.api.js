import { baseUrl } from "../const.js";

async function getCars() {
  try {
    const response = await fetch(baseUrl);

    const data = await response.json();

    return data.cars;
  } catch (error) {
    console.error("Get Cars Failed: ", error);
  }
}

export { getCars };
