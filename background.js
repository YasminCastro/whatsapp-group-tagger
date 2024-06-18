chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLastSentTime") {
    chrome.storage.local.get(["lastSentTime"], (result) => {
      sendResponse({ lastSentTime: result.lastSentTime });
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === "setLastSentTime") {
    chrome.storage.local.set({ lastSentTime: message.time }, () => {
      sendResponse();
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === "closePopup") {
    chrome.windows.getCurrent((window) => {
      chrome.windows.remove(window.id);
    });
  }
});
