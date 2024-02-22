browser.storage.sync.get({
  'yps-1-ll': true,
  'yps-2-wl': false
}, function (items) {
  // move playlists outside of the expandable list, into the list, so it can all be sorted
  wait("#section-items").then(() => {
    onVisible(document.querySelector(".ytd-guide-entry-renderer"), () => shuffle());
  });

  const elements = [
    ["expandable-items", "#expandable-items"],
    ["playlists", ".ytd-add-to-playlist-renderer"],
  ];

  elements.forEach(function (element) {
    wait(element[1]).then(() => {    
      onVisible(document.querySelector(element[1]), () => sort(element[0]));
    });
  });

  function shuffle() {
    let section = document.getElementById("section-items");

    [...section.children]
      .forEach((item) => {
        let href = item.querySelector('a').href;

        if (href.indexOf('/playlist') > 0 && href.length > 40) {
          document.getElementById("expandable-items").appendChild(item);
        }
    });
  }

  function sort(element) {
    let playlists = document.getElementById(element);

    [...playlists.children]
      .sort((a,b) => a.innerText.localeCompare(b.innerText, undefined, {numeric: true}))
      .forEach((node) => {
        if (!items['yps-1-ll'] && node.innerText === "Liked videos") return;
        if (!items['yps-2-wl'] && node.innerText === "Watch Later") return;

        playlists.appendChild(node)
      });
  }

  function wait(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  function onVisible(element, callback) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          callback(element);
        }
      });
    }).observe(element);
  }
});
