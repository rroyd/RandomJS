const [about, howto, credits] = document.querySelectorAll(".link");
const hamburger = document.querySelector(".hamburger");
const linksforHamburger = document.querySelector(".collapse");
const [inputLocation, submitLocation] =
  document.querySelectorAll("*[name=location]");
const [results, resultsForCities] = document.querySelectorAll(".results");
const [one, two, three, four] = document.querySelectorAll("section");
const [inputCity, submitCity] = document.querySelectorAll("*[name=city]");
const categories = document.querySelector(".category");
const cards = document.querySelector(".cards");
const map = document.querySelector(".map");

let places;
let allCitys = [];
let currentPlaces = [];

let collapsed = false,
  selectedCountry,
  selectedFlag,
  selectedCity,
  selectedCategory,
  id; //Variables for debouncing

two.style.display = "none";
two.style.opacity = "0";
three.style.display = "none";
three.style.opacity = "0";

//HAMBURGER FUNCTIONALITY
hamburger.addEventListener("click", () => {
  linksforHamburger.id = collapsed ? "hide" : "";
  collapsed = !collapsed;
});
//COUNTY API REQUEST USING FETCH API
async function requestCountries(query) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    const parsedData = await res.json();
    console.log("Countries request success");
    return parsedData.map((country) => {
      const countryEl = document.createElement("div");
      const countryTitle = document.createElement("h3");
      countryEl.classList.add("item");
      countryEl.style.opacity = 1;
      countryEl.textContent = country.flag;
      countryTitle.textContent = country.name.common;
      countryEl.append(countryTitle);
      return countryEl;
    }); //RETURNING ARRAY of flags
  } catch (e) {
    results.innerHTML = "<h1>No results found</h1>";
    throw "Error occurred, " + e;
  }
}
//USING AXIOS TO RETRIEVE CITIES OF COUNTRIES
async function requestCities(searchQuery) {
  allCitys = [];
  let config = {
    method: "GET",
    url: "https://api.thecompaniesapi.com/v2/locations/cities",
    params: {
      search: searchQuery,
      size: 20,
      page: 1,
    },
  };
  try {
    let res = await axios(config);
    let currPage;
    while (res.data.cities.length !== 0) {
      currPage = [...res.data.cities];
      currPage = currPage
        .filter(
          (city) =>
            city.country.name.toLowerCase() ===
            selectedCountry.innerText.toLowerCase()
        )
        .map((city) => {
          return {
            name: city.name,
            lat: city.latitude,
            long: city.longitude,
          };
        });

      console.log(currPage);

      currPage.forEach(({ name, lat, long }) => {
        let cityEl = document.createElement("div");
        let cityh3 = document.createElement("h3");

        cityEl.classList.add("item");
        cityh3.textContent = name;

        cityEl.append(cityh3);
        resultsForCities.append(cityEl);
      });

      config.params.page++;
      currPage.forEach((city) => allCitys.push(city));
      res = await axios(config);
    }
    console.log(allCitys);
    return allCitys;
  } catch (e) {
    throw e;
  }
}

//REQUEST USING THE BUTTON
submitLocation.addEventListener("click", async (e) => {
  updateResults();
});

//LIVE SEARCH WITH A SECOND DEBOUNCE USING FUNCTION FACTORY
function debounceOperation(op, t) {
  let changing = false,
    id;
  return (...args) => {
    if (changing) {
      clearTimeout(id);
      id = setTimeout(op, t);
      return;
    }
    changing = true;
    id = setTimeout(op, t);
  };
}

const debouncedUpdateResults = debounceOperation(updateResults, 500);
inputLocation.addEventListener("input", () => {
  debouncedUpdateResults();
});

//async function updateResults(elementValue, fetchFn, appendingElement) {
async function updateResults() {
  results.innerHTML =
    "<div class = 'loading'><img src = './assets/load.gif'></div>";
  const entities =
    inputLocation.value != ""
      ? await requestCountries(inputLocation.value)
      : null;
  results.innerHTML = "";
  entities != null && entities.forEach((entities) => results.append(entities));
  changing = false;
}

function fade(one, two) {
  one.style.opacity = 0;
  new Promise((resolve) => {
    setTimeout(() => {
      two.style.display = "";
      one.style.display = "none";
      resolve();
    }, 500);
  }).then(() => {
    two.style.opacity = 1;
  });
}
//SET SELECTED COUNTRY
results.addEventListener("click", async (e) => {
  if (e.target.classList.contains("item")) {
    [selectedFlag, selectedCountry] = e.target.childNodes;
    fade(one, two);
  }
});
//SEARCH CITY
submitCity.addEventListener("click", async () => {
  resultsForCities.innerHTML = "";
  allCitys = await requestCities(inputCity.value.toLowerCase());
  allCitys.length === 0 && (allCitys.innerHTML = "<h1>No results found </h1>");
});
//CITY SELECTED AND RETRIEVING LAT, LONG OF CITY
resultsForCities.addEventListener("click", async (e) => {
  console.log(e.target);
  if (e.target.tagName === "H3") {
    fade(two, three);
    selectedCity = allCitys.find((city) => city.name === e.target.textContent);
    console.log(selectedCity);
  }
});
//GET MAP FROM GEOAPIFY API
async function retrieveMap(long, lat) {
  let params = {
    apiKey: "2f750409910b4106a8c5bda082b916e3",
    width: 1000,
    height: 1000,
    center: `lonlat:${long},${lat}`,
  };

  try {
    const res = await axios({
      method: "GET",
      url: "https://maps.geoapify.com/v1/staticmap",
      params: params,
    });
    return res;
  } catch (e) {
    throw "Error";
  }
}

// GETTING PLACES BASED ON CATEGORY
async function fetchPlaces(category, lat, long) {
  let config = {
    method: "GET",
    url: "https://api.geoapify.com/v2/places",
    params: {
      apiKey: "2f750409910b4106a8c5bda082b916e3",
      categories: category,
      filter: `circle:${long},${lat},10000`, //Assuming every city is 10km...
    },
  };
  try {
    const res = await axios(config);

    let places = res.data.features;
    places = places
      .map(place => {
        return {
          name: place.properties.name,
          address: place.properties.address_line2,
          lat: place.geometry.coordinates[0],
          long: place.geometry.coordinates[1]
        }
      })
    return places;
  } catch (e) {
    throw e;
  }
}

//SELECTING CATEGORY CENTERING MAP ON POSITIONS OF COUNTRY
categories.addEventListener("click", async (e) => {
  if (e.target.classList.contains("item")) {
    let { lat, long } = selectedCity;
    selectedCategory = e.target;
    let catergoryQuery = selectedCategory.getAttribute("name");
    fade(three, four);

    places = await fetchPlaces(catergoryQuery, lat, long);
    console.log(places)

    let url = `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&apiKey=2f750409910b4106a8c5bda082b916e3&center=lonlat:${long},${lat}&zoom=10.5&marker=`
    
    places.forEach(({name, address, long,lat},i) => {
      const cardEl = document.createElement("div");
      const titleEl = document.createElement("h3");
      const addressEl = document.createElement("p");
      
      
      if(name !== "") {
        titleEl.textContent = name;
        addressEl.textContent = address;

        cardEl.classList.add("card");
        cardEl.append(titleEl,addressEl);
        cards.append(cardEl);

        url += `lonlat:${lat},${long};type:awesome;color:%231db510;size:xx-large;icon:apple-alt;whitecircle:no`
        if (places.length - 1 !== i) {
          url += `|`
        }
    }
    })



    const image = document.createElement("img");
    image.src = url;
    image.width = 1000;
    image.height = 700;
    map.append(image);
  }
});

cards.addEventListener('click', (e) => {
  if(e.target.classList.contains("card") || e.target.tagName === "H3" || e.target.tagName === "P") {
    let el = e.target;
    if(el.tagName === "H3" || el.tagName === "P") {
      el = el.parentElement;
    }
    el = el.childNodes[0].textContent;
    open(`https://www.google.com/search?q=${el}`);
    
    
  }
})