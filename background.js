const settings = {
  enabled: false,
  skippedRules: {
    zIndexAuto: true,
    visibilityHidden: true,
    displayNone: true,
    zeroSize: true,
  },
  voidElements: [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ],
  blackListElements: [
    'script',
    'style',
  ],
  log: {
    console: true,
    sortByZIndex: true,
  },
  colorTheme: 'a',
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    { settings: settings },
    () => console.info('Default settings stored.')
  );
});
