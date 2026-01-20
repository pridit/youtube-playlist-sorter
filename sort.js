browser.storage.sync.get(
  {
    "yps-2-wl": false,
  },
  function (items) {
    const elements = [
      [
        "toggleableListItemViewModelHost",
        ".ytContextualSheetLayoutContentContainer",
      ],
    ];

    elements.forEach(function (element) {
      wait(element[1]).then(() => {
        onVisible(document.querySelector(element[1]), () => {
          sort(
            document.querySelector('[aria-label="Save video to..."]')
              ?.parentElement.nextElementSibling,
          );
        });
      });
    });

    function sort(playlists) {
      if (!playlists) return;

      let playlist = playlists.getElementsByClassName(elements[0][0]);

      [...playlist]
        .sort((a, b) =>
          a.innerText.localeCompare(b.innerText, undefined, { numeric: true }),
        )
        .reverse()
        .forEach((node, index) => {
          if (!items["yps-2-wl"] && node.innerText.includes("Watch later"))
            return;

          node.style.order = playlist.length - index;
        });
    }

    function wait(selector) {
      return new Promise((resolve) => {
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
          subtree: true,
        });
      });
    }

    function onVisible(element, callback) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            callback(element);
          }
        });
      }).observe(element);
    }
  },
);
