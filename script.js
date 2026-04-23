//You can edit ALL of the code here
let allShows = [];
let allEpisodes = [];
let currentShowId = null;

const cache = {
  shows: null,
  episodesByShowId: {},
};


function setup() {
  loadShows();
}

window.onload = setup;


function loadShows() {
  if (cache.shows) {
    allShows = cache.shows;
    renderShowsView(allShows);
    return;
  }

  fetch("https://api.tvmaze.com/shows")
    .then((res) => res.json())
    .then((data) => {
      allShows = data.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );

      cache.shows = allShows;
      renderShowsView(allShows);
    })
    .catch((err) => console.error(err));
}

function renderShowsView(showList) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "TV Shows";

  const searchInput = document.createElement("input");
  searchInput.placeholder = "Search shows...";

  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show...";
  select.appendChild(defaultOption);

  allShows.forEach((show) => {
    const opt = document.createElement("option");
    opt.value = show.id;
    opt.textContent = show.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    if (!select.value) return;
    openShow(select.value);
  });

  const container = document.createElement("div");

  function renderCards(list) {
    container.innerHTML = "";

    list.forEach((show) => {
      const card = document.createElement("article");

      card.innerHTML = `
        <h2>${show.name}</h2>
        <img src="${show.image?.medium || ""}">
        <p>${show.summary || ""}</p>
        <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${show.rating?.average || "N/A"}</p>
        <p><strong>Runtime:</strong> ${show.runtime || "N/A"}</p>
      `;

      card.onclick = () => openShow(show.id);

      container.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allShows.filter((show) =>
      show.name.toLowerCase().includes(term) ||
      show.genres.join(" ").toLowerCase().includes(term) ||
      (show.summary || "").toLowerCase().includes(term)
    );

    renderCards(filtered);
  });

  renderCards(showList);

  root.append(title, select, searchInput, container);
}


function openShow(showId) {
  currentShowId = showId;
  loadEpisodes(showId);
  renderEpisodesView();
}

function loadEpisodes(showId) {
  if (cache.episodesByShowId[showId]) {
    allEpisodes = cache.episodesByShowId[showId];
    updateEpisodes();
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      cache.episodesByShowId[showId] = data;
      allEpisodes = data;
      updateEpisodes();
    })
    .catch(() => {
      console.error("Error loading episodes");
    });
}

function renderEpisodesView() {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Shows";
  backBtn.onclick = () => renderShowsView(allShows);

  const search = document.createElement("input");
  search.placeholder = "Search episodes...";
  search.oninput = updateEpisodes;

  const select = document.createElement("select");
  select.id = "episode-select";
  select.onchange = updateEpisodes;

  const count = document.createElement("p");
  count.id = "count";

  const container = document.createElement("div");
  container.id = "episodes-container";

  root.append(backBtn, select, search, count, container);
}


function updateEpisodes() {
  const term =
    document.querySelector("input[placeholder='Search episodes...']")
      ?.value?.toLowerCase() || "";

  const select = document.getElementById("episode-select");

  if (select) {
    select.innerHTML = "";

    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All episodes";
    select.appendChild(allOpt);

    allEpisodes.forEach((ep) => {
      const opt = document.createElement("option");
      opt.value = ep.id;
      opt.textContent = `S${ep.season}E${ep.number} - ${ep.name}`;
      select.appendChild(opt);
    });
  }

  let filtered = allEpisodes.filter((ep) =>
    ep.name.toLowerCase().includes(term) ||
    (ep.summary || "").toLowerCase().includes(term)
  );

  if (select?.value && select.value !== "all") {
    filtered = filtered.filter((ep) => String(ep.id) === select.value);
  }

  renderEpisodes(filtered);
  updateCount(filtered.length);
}

function renderEpisodes(list) {
  const container = document.getElementById("episodes-container");
  container.innerHTML = "";

  list.forEach((ep) => {
    const card = document.createElement("article");

    card.innerHTML = `
      <h2>${ep.name} - S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}</h2>
      <img src="${ep.image?.medium || ""}">
      <div>${ep.summary || ""}</div>
    `;

    container.appendChild(card);
  });
}

function updateCount(current) {
  const count = document.getElementById("count");
  if (count) {
    count.textContent = `Displaying ${current}/${allEpisodes.length} episodes`;
  }
}