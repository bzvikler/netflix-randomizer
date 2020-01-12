// insert style refs in header
var link = document.createElement('link');
link.rel="stylesheet";
link.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
document.head.appendChild(link);

// initial injection
insertButtonIntoSeries();

// additional injections upon url and tab changes
let url = window.location.href;
['click','popstate', 'onload'].forEach( evt =>
        window.addEventListener(evt, function () {
            requestAnimationFrame(()=>{
                if (url !== location.href) {
                    insertButtonIntoSeries();
                }
                url = location.href;
            });
        }, true)
    );
document.querySelector("div.jawBone > ul").addEventListener("click", function () {
    requestAnimationFrame(() => insertButtonIntoSeries());
})

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
                    }
                })
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
        shuffleButton.setAttribute("class", "nf-icon-button nf-flat-button nf-flat-button-primary nf-flat-button-uppercase");
        
        var buttonContent = document.createElement("span");
        buttonContent.setAttribute("class", "nf-flat-button-icon");
        buttonContent.innerHTML = '<i class="fa fa-random" style="font-size: 11px"></i>';
        
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
            if (n.id === "randomize-button") shuffleButtons.push(n)
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
    </div>`
    let container = document.getElementById(id);
    var overlay = document.createElement('div');
    overlay.id = "overlay";
    overlay.innerHTML = icon;
    overlay.setAttribute("class", "shuffle-overlay");
    container.appendChild(overlay);
}

function playRandomEpisode(id) {
    renderAnimation(id);
    // TODO: uncomment below
    // shuffleEpisodes();
}
