const input = document.querySelector("#query");
const searchBtn = document.querySelector("#search");
const form = document.querySelector("form");
const results = document.querySelector("#results");

const makeReq = async (query) => {
  try {
    const res = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${query}`
    );
    return res;
  } catch (e) {
    throw `Error, ${e}`;
  }
};

const compareDate = (show1, show2) => {
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
  sortFrom: "lth",
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
  imageEl.src = image.original;
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
  console.log(filters.sortFrom, filters.sortBy);
});

searchBtn.addEventListener("click", async () => {
  const res = await makeReq(input.value);
  const shows = res.data;

  results.innerHTML = "";

  shows.sort(filterFns[filters.sortBy]);

  filters.sortFrom === "htl" && shows.reverse();

  shows.forEach((show) => console.log(show.score));

  shows.forEach(({ show, score }) => {
    makeCard(show, score);
  });
});
