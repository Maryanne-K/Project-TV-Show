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
