const input = document.querySelector("#query");
const searchBtn = document.querySelector("#search");
const form = document.querySelector("form");
const results = document.querySelector("#results");

const makeReq = async (query) => {
  try {
    let url = `https://api.tvmaze.com/search/shows?q=${query}`;
    query = "" && (url = "https://api.tvmaze.com/shows");
    const res = await axios.get(url);
    return res;
  } catch (e) {
    throw `Error, ${e}`;
  }
};

const compareDate = (show1, show2) => {
  if (!show1.show.premiered || !show2.show.premiered) {
    return 0;
  }
  return (
    parseInt(show1.show.premiered.replaceAll("-")) -
    parseInt(show2.show.premiered.replaceAll("-"))
  );
};

const compareRating = (show1, show2) => {
  return show1.score - show2.score;
};

const filters = {
  sortBy: "date",
  sortFrom: "htl",
};

const filterFns = {
  date: compareDate,
  rating: compareRating,
};

const makeCard = ({ name, image, summary, premiered }, score) => {
  const card = document.createElement("div");
  const imageEl = document.createElement("img");
  const title = document.createElement("h1");
  const dateReleased = document.createElement("div");
  const description = document.createElement("p");
  const rating = document.createElement("h1");

  card.classList.add("card", "hide");
  image.original !== null && (imageEl.src = image.original);
  title.textContent = name;
  dateReleased.textContent = premiered;
  description.innerHTML = summary;
  rating.textContent = `${parseInt(score * 100)} / 100`;

  card.append(imageEl, title, dateReleased, description, rating);
  results.append(card);

  setTimeout(() => {
    card.classList.remove("hide");
  }, 100);
};

form.addEventListener("submit", (e) => e.preventDefault());

form.addEventListener("change", (e) => {
  e.target.name === "sort" && (filters.sortFrom = e.target.value);
  e.target.name === "filter" && (filters.sortBy = e.target.value);
});

searchBtn.addEventListener("click", async () => {
  const res = await makeReq(input.value);
  const shows = res.data;

  results.innerHTML = "";

  if (shows.length === 0) {
    const noResults = document.createElement("h1");
    noResults.textContent = "No results found";
    noResults.style.textAlign = "center";
    results.append(noResults);
  } else {
    shows.sort(filterFns[filters.sortBy]);

    filters.sortFrom === "htl" && shows.reverse();

    shows.forEach(({ show, score }) => {
      makeCard(show, score);
    });
  }
});
