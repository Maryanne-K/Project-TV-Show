//You can edit ALL of the code here

//You can edit ALL of the code here
let allEpisodes = [];
let allShows = [];
let currentShowId = 82; 
let cache = {};// Default to "Game of Thrones"

function setup() {
  fetch ("https://api.tvmaze.com/shows")
  .then((response) => response.json())
  .then((shows) => {
    allShows = shows;

    shows.sort((a,b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  populateShowSelector(shows);
  fetchEpisodes(currentShowId);
  
});
}
function fetchEpisodes (ShowId) {
  const url = `https://api.tvmaze.com/shows/${ShowId}/episodes`;
  
  if (cache[url]) {
    allEpisodes = cache[url]; // ✅ updates the outer variable
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
    return;
  }

  fetch(url)
    .then((response) => response.json())
    .then((episodes) => {
      cache[url] = episodes; // Cache the episodes for future use

      allEpisodes = episodes; // ✅ updates the outer variable
      makePageForEpisodes(allEpisodes);
      populateEpisodeSelector(allEpisodes);
    })

    .catch((error) => {
      const rootElem = document.getElementById("root");
      rootElem.innerHTML = `
        <p class="error">Oops! Could not load episodes.</p>
      `;
      console.error("Fetch error:", error);
    });
  
  }

function populateShowSelector(shows) {
  const select = document.getElementById("show-selector");
  select.innerHTML = "";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.textContent = show.name;
    option.value = show.id;
    select.appendChild(option);
  });
  
  select.addEventListener("change", handleShowChange);

  select.value = currentShowId; 
}

function handleShowChange(event) {
  currentShowId = Number(event.target.value);

  document.getElementById("search").value = "";
  document.getElementById("selector").value = "all";
  
  fetchEpisodes (currentShowId);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const mainElem = document.createElement("main");
  mainElem.classList.add("container");

  const count = document.getElementById("count");
  count.textContent = `Displaying ${episodeList.length}/${allEpisodes.length}`;

  episodeList.forEach((episode) => {
    const { name, season, number, image, summary } = episode;
    const paddedSeason = String(season).padStart(2, "0");
    const paddedNumber = String(number).padStart(2, "0");

    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode-card");
    episodeDiv.innerHTML = `
    <h2 class="title">${name} - S${paddedSeason}E${paddedNumber}</h2>
    <img
  class="episode-image"
  src="${image?.medium ||''}"
  alt="episode image" />
  ${summary || ''}
  `;
    mainElem.appendChild(episodeDiv);
    rootElem.appendChild(mainElem);
  });
}
function populateEpisodeSelector(episodeList) {
  const select = document.getElementById("selector");
  select.innerHTML = '<option value="all">All Episodes</option>';

  episodeList.forEach((episode, index) => {
    const { name, season, number } = episode;
    const paddedSeason = String(season).padStart(2, "0");
    const paddedNumber = String(number).padStart(2, "0");

    const option = document.createElement("option");
    option.textContent = `S${paddedSeason}E${paddedNumber} - ${name}`;
    option.value = index;
    select.appendChild(option);
  });
}

function searchEpisode(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      (episode.summary || "").toLowerCase().includes(searchTerm),
  );

  makePageForEpisodes(filteredEpisodes);
}

function selectEpisode(event) {
  const episodeValue = event.target.value;
  if (episodeValue === "all") {
    makePageForEpisodes(allEpisodes);
  } else {
    makePageForEpisodes([allEpisodes[episodeValue]]);
  }
}

window.onload = setup;