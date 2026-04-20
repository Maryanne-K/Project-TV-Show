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

    const article = document.createElement("article");
    article.className = "episode";

    const img = document.createElement("img");
    if (episode.image && episode.image.medium) {
      img.src = episode.image.medium;
      img.alt = episode.name;
    } else {
      img.alt = "No image available";
    }

    const h3 = document.createElement("h3");
    h3.textContent = `${episode.name} - ${episodeCode}`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Season ${episode.season} • Episode ${episode.number}`;

    const summary = document.createElement("div");
    summary.className = "summary";
    summary.innerHTML = episode.summary || "";

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(meta);
    article.appendChild(summary);

    rootElem.appendChild(article);
  });
}

window.onload = setup;
