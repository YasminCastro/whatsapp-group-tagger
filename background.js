chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getGroupData") {
    chrome.storage.local.get(["groupData"], (result) => {
      console.log("Retrieving group data:", result.groupData);
      sendResponse({ groupData: result.groupData || [] });
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === "setLastSentTime") {
    chrome.storage.local.get(["groupData"], (result) => {
      let groupData = result.groupData || [];
      const groupIndex = groupData.findIndex(
        (group) => group.groupName === message.groupName
      );

      if (groupIndex > -1) {
        groupData[groupIndex].lastSentTime = message.time;
      } else {
        groupData.push({
          groupName: message.groupName,
          lastSentTime: message.time,
        });
      }

      console.log("Setting group data:", groupData);
      chrome.storage.local.set({ groupData: groupData }, () => {
        console.log("Group data set successfully");
        sendResponse();
      });
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (message.action === "closePopup") {
    chrome.windows.getCurrent((window) => {
      chrome.windows.remove(window.id);
    });
  }
});
