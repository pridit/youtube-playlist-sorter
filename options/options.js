(function () {
  "use strict";

  const checkboxes = document.getElementsByClassName("option");
  const options = {};

  let element;

  for (let i = 0; i < checkboxes.length; i++) {
    element = checkboxes[i];

    options[element.dataset.option] = element;

    element.addEventListener("change", function (e) {
      if (!e.isTrusted) return;

      const store = {};

      store[this.dataset.option] = this.checked;

      browser.storage.sync.set(store);
    });
  }

  browser.storage.sync.get(Object.keys(options)).then((items) => {
    for (const item in items) {
      element = options[item];
      element.checked = items[item];
    }
  });

  browser.storage.sync.onChanged.addListener((changes) => {
    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
      if (options[item]) {
        options[item].checked = !!changes[item].newValue;
      }
    }
  });
})();
