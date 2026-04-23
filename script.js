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
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
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

    const filtered = allShows.filter(
      (show) =>
        show.name.toLowerCase().includes(term) ||
        show.genres.join(" ").toLowerCase().includes(term) ||
        (show.summary || "").toLowerCase().includes(term),
    );

    renderCards(filtered);
  });

  renderCards(showList);

  const credit = document.createElement("p");
  credit.innerHTML = `
  Data originally from <a href="https://www.tvmaze.com" target="_blank">TVMaze.com</a>
`;

  root.append(title, select, searchInput, container, credit);
}

function openShow(showId) {
  currentShowId = showId;
  renderEpisodesView();
  loadEpisodes(showId);
}
function populateEpisodeSelector() {
  const select = document.getElementById("episode-select");
  if (!select) return;

  select.innerHTML = "";

  allEpisodes.forEach((ep) => {
    const opt = document.createElement("option");
    opt.value = ep.id;
    opt.textContent = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")} - ${ep.name}`;

    select.appendChild(opt);
  });
}

function loadEpisodes(showId) {
  if (cache.episodesByShowId[showId]) {
    allEpisodes = cache.episodesByShowId[showId];
    
    populateEpisodeSelector();
    renderEpisodes(allEpisodes);
    updateCount(allEpisodes.length);
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      cache.episodesByShowId[showId] = data;
      allEpisodes = data;
      
      populateEpisodeSelector();
      renderEpisodes(allEpisodes);
      updateCount(allEpisodes.length);
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
  backBtn.onclick = () => {
    currentShowId = null;
    allEpisodes = [];
    renderShowsView(allShows);
  };

  const search = document.createElement("input");
  search.placeholder = "Search episodes...";
  search.id = "episode-search";
  search.oninput = updateEpisodes;

  const select = document.createElement("select");
  select.id = "episode-select";
  select.onchange = updateEpisodes;

  const count = document.createElement("p");
  count.id = "count";

  const container = document.createElement("div");
  container.id = "episodes-container";

  const credit = document.createElement("p");
  credit.innerHTML = `
  Data originally from <a href="https://www.tvmaze.com" target="_blank">TVMaze.com</a>
`;

  root.append(backBtn, select, search, count, container, credit);
}

function updateEpisodes() {
  const term =
    document.getElementById("episode-search")?.value?.toLowerCase() || "";

  const select = document.getElementById("episode-select");

  let selectedValue = "all";
  if (select) {
    selectedValue = select.value;

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

    select.value = selectedValue;
  }

  let filtered = allEpisodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(term) ||
      (ep.summary || "").toLowerCase().includes(term),
  );

  if (selectedValue !== "all") {
    filtered = filtered.filter((ep) => String(ep.id) === selectedValue);
  }

  renderEpisodes(filtered);
  updateCount(filtered.length);
}

function renderEpisodes(list) {
  const container = document.getElementById("episodes-container");
  if (!container) return;
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