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
const inBtn = document.querySelector("#in");
const outBtn = document.querySelector("#out");
//DOM Elements

let collapsed = false,
  mapURL,
  zoom = 12,
  places,
  image,
  long,
  lat,
  allCitys = [],
  selectedCountry,
  selectedFlag,
  selectedCity,
  selectedCategory,
  id; //Variables

//HAMBURGER FUNCTIONALITY
hamburger.addEventListener("click", () => {
  linksforHamburger.id = collapsed ? "hide" : "";
  collapsed = !collapsed;
});

if (two && three && four) {
  two.style.display = "none";
  two.style.opacity = "0";
  three.style.display = "none";
  three.style.opacity = "0";
  four.style.display = "none";
  four.style.opacity = "0";

  const gif = document.createElement("img");
  const loadDiv = document.createElement("div");
  loadDiv.classList.add("loading");
  gif.width = "50%";
  gif.src = "./assets/load.gif";
  loadDiv.append(gif);

  //LOADING GIF
  function toggleLoading(targetElement, isSwitch) {
    try {
      !isSwitch ? loadDiv.remove() : targetElement.append(loadDiv);
    } catch (e) {
      loadDiv.remove();
    }
  }
  //COUNTY API REQUEST USING FETCH API
  async function requestCountries(query) {
    toggleLoading(results, true);
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
      toggleLoading(results, false);
      results.innerHTML = "<h1>No results found</h1>";
      throw "Error occurred, " + e;
    }
  }
  //USING AXIOS TO RETRIEVE CITIES OF COUNTRIES
  async function requestCities(searchQuery) {
    toggleLoading(resultsForCities, true);
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
      toggleLoading(resultsForCities, false);
      inputCity.value.length === 0 && (resultsForCities.innerHTML = "");
      return allCitys;
    } catch (e) {
      resultsForCities.innerHTML = "<h1>No results found</h1>";
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
        id = setTimeout(() => op(...args), t);
        return;
      }
      changing = true;
      id = setTimeout(() => op(...args), t);
    };
  }

  const debouncedUpdateResults = debounceOperation(updateResults, 500);
  const debouncedCityResults = debounceOperation(requestCities, 500);

  inputLocation.addEventListener("input", () => {
    debouncedUpdateResults();
  });

  inputCity.addEventListener("input", () => {
    resultsForCities.innerHTML = "";
    debouncedCityResults(inputCity.value);
  });

  //async function updateResults(elementValue, fetchFn, appendingElement) {
  async function updateResults() {
    results.innerHTML = "";
    toggleLoading(results, true);
    const entities =
      inputLocation.value != ""
        ? await requestCountries(inputLocation.value)
        : null;
    toggleLoading(results, false);
    entities != null &&
      entities.forEach((entities) => results.append(entities));
    changing = false;
  }
  //FADE BETWEEN SECTIONS
  function fade(one, two) {
    loading = false;
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
    allCitys.length === 0 &&
      (allCitys.innerHTML = "<h1>No results found </h1>");
  });
  //CITY SELECTED AND RETRIEVING LAT, LONG OF CITY
  resultsForCities.addEventListener("click", async (e) => {
    console.log(e.target);
    if (e.target.tagName === "H3") {
      fade(two, three);
      selectedCity = allCitys.find(
        (city) => city.name === e.target.textContent
      );
    }
  });
  //ADD CARDS
  function addCards() {
    places.forEach(({ name, address, lat: currLat, long: currLong }, i) => {
      const cardEl = document.createElement("div");
      const titleEl = document.createElement("h3");
      const addressEl = document.createElement("p");
      const buttons = document.createElement("div");
      const googleButton = document.createElement("button");
      const centerButton = document.createElement("button");

      cardEl.setAttribute("lat", currLat);
      cardEl.setAttribute("long", currLong);

      buttons.classList.add("buttons");
      googleButton.onclick = () =>
        open(`https://www.google.com/search?q=${name}`);
      centerButton.onclick = async () => {
        lat = currLong;
        long = currLat;
        await retrieveMap(long, lat, zoom);
      };

      if (name !== "") {
        googleButton.textContent = "Google this place";
        centerButton.textContent = "Center map to place";
        titleEl.textContent = name;
        addressEl.textContent = address;

        buttons.append(googleButton, centerButton);
        cardEl.classList.add("card");
        cardEl.append(titleEl, addressEl, buttons);
        cards.append(cardEl);
      }
    });
  }
  //GET MAP FROM GEOAPIFY API
  async function retrieveMap(long, lat, zoom) {
    toggleLoading(map);
    if (image) image.remove();

    mapURL = `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&apiKey=2f750409910b4106a8c5bda082b916e3&center=lonlat:${long},${lat}&zoom=${zoom}&marker=`;

    if (places) {
      places.forEach(({ name, address, lat, long }, i) => {
        if (name !== "") {
          mapURL += `lonlat:${lat},${long};type:awesome;color:%231db510;size:xx-large;icon:none;whitecircle:no`;
          if (places.length - 1 !== i) {
            mapURL += `|`;
          }
        }
      });
    }
    image = document.createElement("img");
    image.src = mapURL;
    image.width = 1000;
    image.height = 700;
    map.append(image);
    toggleLoading(map);
  }

  // GETTING PLACES BASED ON CATEGORY
  async function fetchPlaces(category, lat, long) {
    toggleLoading(cards, true);
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
      places = places.map((place) => {
        return {
          name: place.properties.name,
          address: place.properties.address_line2,
          lat: place.geometry.coordinates[0],
          long: place.geometry.coordinates[1],
        };
      });
      toggleLoading(cards, false);
      return places;
    } catch (e) {
      throw e;
    }
  }

  //SELECTING CATEGORY CENTERING MAP ON POSITIONS OF COUNTRY
  categories.addEventListener("click", async (e) => {
    if (e.target.classList.contains("item")) {
      lat = selectedCity.lat;
      long = selectedCity.long;
      selectedCategory = e.target;
      let catergoryQuery = selectedCategory.getAttribute("name");
      four.style.display = "";
      four.style.opacity = "";
      fade(three, four);

      places = await fetchPlaces(catergoryQuery, lat, long);
      await retrieveMap(long, lat, zoom, places);
      addCards();
    }
  });

  cards.addEventListener("click", async (e) => {
    if (
      e.target.classList.contains("card") ||
      e.target.tagName === "H3" ||
      e.target.tagName === "P"
    ) {
      let el = e.target;
      if (el.tagName === "H3" || el.tagName === "P") {
        el = el.parentElement;
      }
      // el = el.childNodes[0].textContent;
      // open(`https://www.google.com/search?q=${el}`);

      long = parseFloat(el.getAttribute("lat"));
      lat = parseFloat(el.getAttribute("long"));
      await retrieveMap(long, lat, zoom);
    }
  });

  inBtn.addEventListener("click", async () => {
    zoom += 0.1;
    await retrieveMap(long, lat, zoom, places);
  });

  outBtn.addEventListener("click", async () => {
    zoom -= 0.1;
    await retrieveMap(long, lat, zoom, places);
  });
}
