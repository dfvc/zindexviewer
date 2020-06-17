const popupElements = {
  skippedRules: {
    zIndexAuto: document.getElementById('settings__skip-z-index-auto'),
    visibilityHidden: document.getElementById('settings__skip-hidden'),
    zeroSize: document.getElementById('settings__skip-empty-sized'),
  },
  log: {
    console: document.getElementById('settings__misc-log-console'),
    sortByZIndex: document.getElementById('settings__misc-log-sorted'),
  },
  colorThemeButtons: document.querySelectorAll('.settings__theme-button'),
  toggleButton: document.getElementById('settings__toggle-button'),
}

let settings = {};

chrome.storage.sync.get(
  'settings',
  (data) => {
    settings = data.settings;
    initPopupFromSettings();
  },
);

popupElements.skippedRules.zIndexAuto.onchange = () => {
  settings.skippedRules.zIndexAuto = popupElements.skippedRules.zIndexAuto.checked;
  storeSettings();
  highlightZIndexNodes();
  highlightZIndexNodes();
};

popupElements.skippedRules.visibilityHidden.onchange = () => {
  settings.skippedRules.visibilityHidden = popupElements.skippedRules.visibilityHidden.checked;
  storeSettings();
  highlightZIndexNodes();
};

popupElements.skippedRules.zeroSize.onchange = () => {
  settings.skippedRules.zeroSize = popupElements.skippedRules.zeroSize.checked;
  storeSettings();
  highlightZIndexNodes();
};

popupElements.log.console.onchange = () => {
  settings.log.console = popupElements.log.console.checked;
  popupElements.log.sortByZIndex.disabled = !popupElements.log.console.checked;
  storeSettings();
  highlightZIndexNodes();
};

popupElements.log.sortByZIndex.onchange = () => {
  settings.log.sortByZIndex = popupElements.log.sortByZIndex.checked;
  storeSettings();
  highlightZIndexNodes();
};

popupElements.colorThemeButtons.forEach((colorThemeButton) => {
  colorThemeButton.onclick = (event) => {
    settings.colorTheme = event.target.name;
    storeSettings();
    initColorThemeFromSettings();
    highlightZIndexNodes();
  };
});

popupElements.toggleButton.onclick = () => {
  settings.enabled = !settings.enabled;
  storeSettings();
  initButtonFromSettings();
  highlightZIndexNodes();
};

storeSettings = () => {
  chrome.storage.sync.set(
    { settings: settings },
    () => console.info('Settings stored.')
  );
};

initPopupFromSettings = () => {
  popupElements.skippedRules.zIndexAuto.checked = settings.skippedRules.zIndexAuto;
  popupElements.skippedRules.visibilityHidden.checked = settings.skippedRules.visibilityHidden;
  popupElements.skippedRules.zeroSize.checked = settings.skippedRules.zeroSize;
  popupElements.log.console.checked = settings.log.console;
  popupElements.log.sortByZIndex.checked = settings.log.sortByZIndex;
  popupElements.log.sortByZIndex.disabled = !popupElements.log.console.checked;
  initButtonFromSettings();
  initColorThemeFromSettings();
};

initButtonFromSettings = () => {
  if (settings.enabled) {
    popupElements.toggleButton.textContent = 'Disable Z-Indexes';
    popupElements.toggleButton.classList.remove('settings__toggle-button--disabled');
    popupElements.toggleButton.classList.add('settings__toggle-button--enabled');
  } else {
    popupElements.toggleButton.textContent = 'Enable Z-Indexes';
    popupElements.toggleButton.classList.remove('settings__toggle-button--enabled');
    popupElements.toggleButton.classList.add('settings__toggle-button--disabled');
  }
};

initColorThemeFromSettings = () => {
  popupElements.colorThemeButtons.forEach((colorThemeButton) => {
    colorThemeButton.textContent = '';
    if (colorThemeButton.name === settings.colorTheme) {
      colorThemeButton.innerHTML = '\u2713';
    }
  });
};

highlightZIndexNodes = () => {
  const code = `var settings = ${JSON.stringify(settings)}`;

  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: code },
        () => chrome.tabs.executeScript({ file: "content.js" }),
      );
    },
  );
}
