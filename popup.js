document.getElementById("tagButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Fechar a popup da extensão
    window.close();

    // Executar o script de conteúdo após fechar a popup
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});
