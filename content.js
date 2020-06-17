init = () => {
  clearTags();

  if (settings.enabled) {
    let nodes = document.querySelectorAll('body *');
    nodes = getFilteredNodes(nodes);

    if (nodes.length) {
      applyTags(nodes);
      applyLogs(nodes);
      applyViewSettings();
    } else {
      alert('No z-indexed nodes found!!')
    }
  }
};

getFilteredNodes = (nodes) => {
  const filteredNodes = [];

  nodes.forEach((node) => {
    if (!isNodeBlackListed(node) && !isNodeSkipped(node)) {
      filteredNodes.push(node);
    }
  });

  return filteredNodes;
};

isNodeBlackListed = (node) => {
  return settings.blackListElements.includes(node.tagName.toLowerCase());
};

isNodeSkipped = (node) => {
  const computedStyling = getComputedStyle(node);

  if (!computedStyling['z-index']) return true;
  if (settings.skippedRules.zIndexAuto && computedStyling['z-index'] === 'auto') return true;
  if (settings.skippedRules.visibilityHidden && computedStyling.visibility === 'hidden') return true;
  if (settings.skippedRules.displayNone && computedStyling.display === 'none') return true;
  if (
    settings.skippedRules.zeroSize &&
    (computedStyling.height === '0px' || computedStyling.width === '0px')
  ) return true;

  return false;
};

getTagForNode = (node) => {
  const computedStyling = getComputedStyle(node);
  const tagLabel = document.createElement('span');
  const tag = document.createElement('div');

  tagLabel.classList.add('zindex-tag-label');
  tagLabel.textContent = computedStyling.zIndex;
  tag.classList.add('zindex-tag');
  tag.appendChild(tagLabel);

  return tag;
};

applyTags = (nodes) => {
  nodes.forEach((node) => {
    node.appendChild(getTagForNode(node));
  });
};

applyLogs = (nodes) => {
  if (settings.log.console) {
    const nodesToLog = settings.log.sortByZIndex ? sortNodeByZIndex(nodes) : nodes;

    console.clear();
    nodesToLog.forEach((node) => {
      console.log('%s: %o', getComputedStyle(node)['z-index'], node);
    });
  }
};

sortNodeByZIndex = (nodes) => {
  const sortedNodes = nodes;

  sortedNodes.sort((nodeA, nodeB) => {
    const zIndexNodeA = parseInt(getComputedStyle(nodeA)['z-index']);
    const zIndexNodeB = parseInt(getComputedStyle(nodeB)['z-index']);

    return zIndexNodeA - zIndexNodeB;
  });

  return sortedNodes;
}

applyViewSettings = () => {
  const body = document.querySelector('body');

  body.classList.add('zindex-container');
  body.classList.add(`zindex-container--${settings.colorTheme}`);
};

clearTags = () => {
  const tagNodes = document.querySelectorAll('.zindex-tag');

  if (tagNodes.length) {
    tagNodes.forEach((tagNode) => tagNode.remove());
  }

  document.querySelector('body').classList.remove('zindex-container--a');
  document.querySelector('body').classList.remove('zindex-container--b');
  document.querySelector('body').classList.remove('zindex-container--c');
  document.querySelector('body').classList.remove('zindex-container--d');
  document.querySelector('body').classList.remove('zindex-container--e');
};

init();
