//You can edit ALL of the code here

let allEpisodes = [];

window.addEventListener("load", init);

function init() {
  showLoading();
  fetchEpisodes();
}

async function fetchEpisodes() {
  try {
    const res = await fetch("https://api.tvmaze.com/shows/82/episodes");

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    allEpisodes = data;

  
    initApp();

  } catch (err) {
    showError();
  }
}

function initApp() {
  makePageForEpisodes(allEpisodes);
  buildEpisodeSelect(allEpisodes);
  updateMatchCount(allEpisodes.length, allEpisodes.length);

  const searchInput = document.getElementById("search");
  const episodeSelect = document.getElementById("episode-select");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.trim();
      const filtered = filterEpisodes(allEpisodes, term);

      makePageForEpisodes(filtered);
      updateMatchCount(filtered.length, allEpisodes.length);
    });
  }

  if (episodeSelect) {
    episodeSelect.addEventListener("change", () => {
      const val = episodeSelect.value;

      if (!val) {
        makePageForEpisodes(allEpisodes);
        updateMatchCount(allEpisodes.length, allEpisodes.length);
        return;
      }

      makePageForEpisodes(allEpisodes);

      setTimeout(() => {
        const target = document.getElementById(`episode-${val}`);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 40);
    });
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    const episodeElem = document.createElement("div");
    episodeElem.className = "episode";
    episodeElem.id = `episode-${episode.id}`;

    const imageUrl = episode.image?.medium || "";

    episodeElem.innerHTML = `
      <h3>${episode.name} - ${episodeCode}</h3>
      <img src="${imageUrl}" alt="${episode.name}" />
      <p>${episode.summary}</p>
    `;

    rootElem.appendChild(episodeElem);
  });

  const credit = document.createElement("p");
  credit.innerHTML = `Data originally from <a href="https://www.tvmaze.com/api">TVMaze API</a>`;
  rootElem.appendChild(credit);
}

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return tmp.textContent || tmp.innerText || "";
}

function filterEpisodes(list, searchTerm) {
  if (!searchTerm) return list.slice();

  const s = searchTerm.toLowerCase();

  return list.filter((ep) => {
    const name = (ep.name || "").toLowerCase();
    const summary = stripHTML(ep.summary).toLowerCase();

    return name.includes(s) || summary.includes(s);
  });
}

function buildEpisodeSelect(list) {
  const sel = document.getElementById("episode-select");
  if (!sel) return;

  sel.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Episodes";
  sel.appendChild(defaultOption);

  list.forEach((ep) => {
    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    const opt = document.createElement("option");
    opt.value = String(ep.id);
    opt.textContent = `${code} - ${ep.name}`;

    sel.appendChild(opt);
  });
}

function updateMatchCount(showing, total) {
  const el = document.getElementById("count");
  if (el) {
    el.textContent = `Showing: ${showing} / ${total}`;
  }
}

function showLoading() {
  document.getElementById("root").innerHTML =
    "<p>Loading episodes...</p>";
}

function showError() {
  document.getElementById("root").innerHTML =
    "<p>❌ Failed to load episodes. Please try again.</p>";
}