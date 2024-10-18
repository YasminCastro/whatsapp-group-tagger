async function tagAllUsers() {
  try {
    const canTag = await canTagGroup();
    if (!canTag) return;

    const usersFound = await getUserNames();
    await typeUsers(usersFound);

    // const currentTime = new Date().getTime();
    // const groupName = await getCurrentGroupName();
    // await setLastSentTime(groupName, currentTime);
  } catch (error) {
    console.log("Unable do tag all users from group", error);
  }
}

tagAllUsers();

async function getUserNames() {
  try {
    const groupHeader = document.querySelector('div._amie[role="button"]');
    if (groupHeader) {
      groupHeader.click();

      await new Promise((resolve) => setTimeout(resolve, 500));

      const closeButton = document.querySelector(
        'div[role="button"][aria-label="Fechar"]'
      );

      if (closeButton) {
        closeButton.click();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const userSpan = document.querySelector(
          "div.x78zum5.x1cy8zhl.xisnujt.x1nxh6w3.xcgms0a.x16cd2qt span[title]"
        );

        if (userSpan) {
          const userNamesText = userSpan.getAttribute("title");
          const userNames = userNamesText
            .split(", ")
            .filter((name) => name !== "Você")
            .map((name) => removeAccents(name));

          return userNames;
        }
      }
    }

    return [];
  } catch (error) {
    console.log("Unable to get users of group", error);
    return [];
  }
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function getCurrentGroupName() {
  try {
    const title = document.querySelector(
      "#main > header > div._amie > div._amif > div > span"
    );

    return title.innerHTML;
  } catch (error) {
    console.log("Unable to get title of group", error);
    return "";
  }
}

async function typeUsers(usersFound) {
  try {
    const chatBox = document.querySelector(
      '[contenteditable="true"][data-tab="10"]'
    );

    if (chatBox) {
      let remainingUsers = usersFound;
      const markedUsers = new Set();

      while (remainingUsers.length > 0) {
        let user = remainingUsers[0];

        console.log("Current user: " + user);

        // Número não salvo
        if (user.trim().startsWith("+")) {
          user = user.slice(0, -1);
        }

        // Limpar e focar na caixa de chat
        chatBox.innerHTML = "";
        chatBox.focus();

        await new Promise((resolve) => setTimeout(resolve, 200));
        document.execCommand("insertText", false, `@${user}`);

        let personNameElement = null;
        for (let i = 0; i < 10; i++) {
          const potentialElements = document.querySelectorAll(
            'div[class="x78zum5 xeuugli"]'
          );

          // Percorre todos os elementos potenciais
          for (let j = 0; j < potentialElements.length; j++) {
            const element = potentialElements[j];
            const fullText = element.textContent.trim();

            // Verifica se este nome ainda não foi marcado
            if (!markedUsers.has(fullText)) {
              personNameElement = element;
              break;
            }
          }

          if (personNameElement) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (personNameElement) {
          personNameElement.click();
          const fullText = personNameElement.textContent.trim();
          markedUsers.add(fullText);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        const spaceEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: " ",
          code: "Space",
          keyCode: 32,
          charCode: 32,
          which: 32,
        });
        chatBox.dispatchEvent(spaceEvent);

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Remova o usuário após processar
        remainingUsers.shift();
      }
    }
    return;
  } catch (error) {
    console.log("Error to type users");
    return;
  }
}

function getGroupData() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getGroupData" }, (response) => {
      if (chrome.runtime.lastError) {
        resolve([]);
      } else {
        resolve(response ? response.groupData : []);
      }
    });
  });
}

function setLastSentTime(groupName, time) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "setLastSentTime", groupName: groupName, time: time },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError);
        }
        resolve();
      }
    );
  });
}

async function canTagGroup() {
  const TIME_LIMIT = 5 * 60 * 1000;
  const currentTime = new Date().getTime();
  const groupData = await getGroupData();
  const groupName = await getCurrentGroupName();

  const groupInfo = groupData.find((group) => group.groupName === groupName);

  if (groupInfo && currentTime - groupInfo.lastSentTime < TIME_LIMIT) {
    const timeRemaining = getTimeRemaining(
      TIME_LIMIT - (currentTime - groupInfo.lastSentTime)
    );
    alert(
      `Você só pode marcar novamente o grupo "${groupName}" após ${timeRemaining}.`
    );
    return false;
  }

  return true;
}

function getTimeRemaining(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} minutos e ${seconds} segundos`;
}
