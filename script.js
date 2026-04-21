//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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
  // give each episode element a stable id so the selector can jump to it
  episodeElem.id = `episode-${episode.id}`;

    const imageUrl = episode.image ? episode.image.medium : "";

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
window.onload = setup;

  // ---- Beginner-friendly Level 200 helpers (search + selector) ----

  // strip HTML so the search matches visible text
  function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  }

  // filter episodes by name OR summary (case-insensitive)
  function filterEpisodes(list, searchTerm) {
    if (!searchTerm) return list.slice(); // return a copy of the full list
    const s = searchTerm.toLowerCase();
    return list.filter(ep => {
      const name = (ep.name || '').toLowerCase();
      const summary = stripHTML(ep.summary).toLowerCase();
      return name.includes(s) || summary.includes(s);
    });
  }

  // populate the episode select with "S01E01 - Title"
  function buildEpisodeSelect(list) {
    const sel = document.getElementById('episode-select');
    if (!sel) return;
    // remove old options (keep first "All episodes")
    sel.querySelectorAll('option:not([value=""])').forEach(o => o.remove());

    list.forEach(ep => {
      const season = String(ep.season).padStart(2, '0');
      const number = String(ep.number).padStart(2, '0');
      const code = `S${season}E${number}`;
      const opt = document.createElement('option');
      opt.value = String(ep.id); // unique id used to find the element
      opt.textContent = `${code} - ${ep.name}`;
      sel.appendChild(opt);
    });
  }

  // small helper to update the match count text
  function updateMatchCount(showing, total) {
    const el = document.getElementById('match-count');
    if (el) el.textContent = `Showing: ${showing} / ${total}`;
  }

  // simple initializer that wires search input and selector
  function initLevel200Simple() {
    const allEpisodes = getAllEpisodes();
    // render initial list (assumes makePageForEpisodes exists)
    makePageForEpisodes(allEpisodes);

    buildEpisodeSelect(allEpisodes);
    updateMatchCount(allEpisodes.length, allEpisodes.length);

    const searchInput = document.getElementById('search');
    const episodeSelect = document.getElementById('episode-select');

    // immediate live search on each keystroke
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        const filtered = filterEpisodes(allEpisodes, searchTerm);
        makePageForEpisodes(filtered);
        updateMatchCount(filtered.length, allEpisodes.length);
      });
    }

    // select jumps to the episode (keeps the full list visible)
    if (episodeSelect) {
      episodeSelect.addEventListener('change', () => {
        const val = episodeSelect.value;
        if (!val) {
          // show all again
          makePageForEpisodes(allEpisodes);
          updateMatchCount(allEpisodes.length, allEpisodes.length);
          return;
        }
        // show all then scroll to the element with id `episode-<id>`
        makePageForEpisodes(allEpisodes);
        setTimeout(() => {
          const target = document.getElementById(`episode-${val}`);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 40); // small delay so DOM is ready
      });
    }
  }

  // run this after page load
  window.addEventListener('load', initLevel200Simple);
