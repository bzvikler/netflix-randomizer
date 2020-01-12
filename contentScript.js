const EPISODES_TAB = "#tab-Episodes";
const SEASONS_DROPDOWN =
  "#pane-Episodes > div > div > div > div.nfDropDown > div";
const SEASONS =
  "#pane-Episodes > div > div > div > div.nfDropDown.widthRestricted.open.theme-lakira > div.sub-menu.theme-lakira > ul > li > a";
const PLAY_BUTTON = "div > div.ptrack-content > div > a";
const NEXT_EPISODE_CHEVRON =
  "#pane-Episodes > div > div > div > div.episodeWrapper > div > div > span.handle.handleNext.active";
const PREV_EPISODE_CHEVRON =
  "#pane-Episodes > div > div > div > div.episodeWrapper > div > div > span.handle.handlePrev.active";
const LAST_EPISODE =
  "#pane-Episodes > div > div > div > div.episodeWrapper > div > div > div > div > div.slider-item:last-of-type > div > div.ptrack-content > div > div.episodeNumber > span";
const ON_SCREEN_EPISODES =
  "#pane-Episodes > div > div > div > div.episodeWrapper > div > div > div > div > div.slider-item";
const EPISODE_NUMBER =
  "div > div.ptrack-content > div > div.episodeNumber > span";

const wait = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
};
const getRandIntInRange = max => Math.floor(Math.random() * Math.floor(max));

const getTitleElement = titleId => {
  console.log(`${titleId}`);
  return document.getElementById(`${titleId}`);
};
const getEpisodeTab = titleElement => titleElement.querySelector(EPISODES_TAB);
const getSeasonDropdown = titleElement =>
  titleElement.querySelector(SEASONS_DROPDOWN);
const getSeasons = titleElement => titleElement.querySelectorAll(SEASONS);
let getNextEpisodeChevron = () => document.querySelector(NEXT_EPISODE_CHEVRON);
const getPrevEpisodeChevron = () =>
  document.querySelector(PREV_EPISODE_CHEVRON);
const getLastEpisode = () => document.querySelector(LAST_EPISODE);
const getOnScreenEpisodes = () => document.querySelectorAll(ON_SCREEN_EPISODES);
const getEpisodeNumber = episode => episode.querySelector(EPISODE_NUMBER);
const getPlayButton = episode => episode.querySelector(PLAY_BUTTON);

const getWithRetry = async (getter, count = 3) => {
  let result = getter();
  for (let i = 0; i < count; i++) {
    if (!result) {
      await wait();
      result = getter();
    } else {
      return result;
    }
  }
};

const shuffleEpisodes = async titleId => {
  console.log(titleId);
  const titleElement = await getWithRetry(getTitleElement.bind(null, titleId));
  // go to episodes
  console.log(titleElement);
  const episodeTab = await getWithRetry(getEpisodeTab.bind(null, titleElement));
  episodeTab.click();
  await wait();
  const seasonDropDown = await getWithRetry(
    getSeasonDropdown.bind(null, titleElement)
  );
  // open seasons drop down
  seasonDropDown.click();
  await wait();
  const seasons = await getWithRetry(getSeasons.bind(null, titleElement));
  const seasonCount = seasons.length;
  const randSeason = seasons[getRandIntInRange(seasonCount)];
  randSeason.click();
  await wait();

  getNextEpisodeChevron = getNextEpisodeChevron.bind(null, titleElement);
  while (await getWithRetry(getNextEpisodeChevron)) {
    getNextEpisodeChevron().click();
    await wait();
  }

  const lastEpisodeNumberSpan = await getWithRetry(getLastEpisode);
  const randEpisode = getRandIntInRange(lastEpisodeNumberSpan.innerHTML);

  while (await getWithRetry(getPrevEpisodeChevron)) {
    const onScreenEpisodes = Array.from(getOnScreenEpisodes());
    const foundEpisodes = onScreenEpisodes.filter(async episode => {
      const episodeNumberSpan = await getWithRetry(
        getEpisodeNumber.bind(null, episode)
      );

      return parseInt(episodeNumberSpan.innerHTML) === randEpisode;
    });

    if (foundEpisodes.length) {
      const foundEpisode = foundEpisodes[0];
      const playButton = await getWithRetry(
        getPlayButton.bind(null, foundEpisode)
      );
      window.location = playButton.href;
      break;
    }

    getPrevEpisodeChevron().click();
    await wait();
  }
};

// SUSAN'S CODE

// insert style refs in header
var link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
document.head.appendChild(link);

// initial injection
insertButtonIntoSeries();

// additional injections upon url and tab changes
let url = window.location.href;
["click", "popstate", "onload"].forEach(evt => {
    window.addEventListener(evt,
    function() {
      requestAnimationFrame(() => {
        if (url !== location.href) {
          url = location.href;
          insertButtonIntoSeries();
        }
      });
    },
    true)
  }
);

function addMenuListener(content) {
  var menu = content.querySelector("div.jawBone > ul");
  if (menu != undefined) {
    menu.addEventListener("click", function() {
      requestAnimationFrame(() => insertButtonIntoSeries());
    });
  }
}


// get jawbones that are series, not movies (aka. has episodes to shuffle)
function insertButtonIntoSeries() {
  var jawbones = document.getElementsByClassName("jawBone");
  for (var jb of jawbones) {
    var id = jb.parentElement.id;
    jb.childNodes.forEach(n => {
      if (n.className === "menu") {
        n.childNodes.forEach(menuItem => {
          if (menuItem.className === "Episodes") {
            insertButton(jb, id);
            addMenuListener(jb);
          }
        });
      }
    });
  }
}

// inserts shuffle button into jawbone
function insertButton(content, id) {
  var actions = content.getElementsByClassName("jawbone-actions");
  for (var action of actions) {
    var shuffleButton = document.createElement("span");
    shuffleButton.setAttribute("id", "randomize-button");
    shuffleButton.setAttribute(
      "class",
      "nf-icon-button nf-flat-button nf-flat-button-primary nf-flat-button-uppercase randomize-button"
    );

    var buttonContent = document.createElement("span");
    buttonContent.setAttribute("class", "nf-flat-button-icon");
    buttonContent.innerHTML =
      '<i class="fa fa-random"></i>';

    var buttonText = document.createElement("span");
    buttonText.setAttribute("class", "nf-flat-button-text");
    buttonText.textContent = "RANDOM";
    shuffleButton.appendChild(buttonContent);
    shuffleButton.appendChild(buttonText);

    // todo: add actual shuffling action
    shuffleButton.addEventListener("click", () => playRandomEpisode(id));

    // dont inject if already tehre
    var shuffleButtons = [];
    action.childNodes.forEach(n => {
      if (n.id === "randomize-button") shuffleButtons.push(n);
    });
    if (shuffleButtons.length > 0) continue;

    // inject before the ptrack-content button
    var listButtons = [];
    action.childNodes.forEach(n => {
      if (n.className === "ptrack-content") listButtons.push(n);
    });
    if (listButtons.length >= 1) {
      var anchor = listButtons[0];
      action.insertBefore(shuffleButton, anchor);
    }
  }
}

function renderAnimation(id) {
  var icon = `
    <div class="container">
        <div class="loading-label">
            CHOOSING EPISODE
        </div>
        <div class="wavecontainer">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        </div>
    </div>`;
  let container = document.getElementById(id);
  var overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.innerHTML = icon;
  overlay.setAttribute("class", "shuffle-overlay");
  container.appendChild(overlay);
}

function playRandomEpisode(id) {
  renderAnimation(id);
  shuffleEpisodes(id);
}
