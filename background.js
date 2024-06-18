chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closePopup") {
    chrome.windows.getCurrent((window) => {
      chrome.windows.remove(window.id);
    });
  }
});
