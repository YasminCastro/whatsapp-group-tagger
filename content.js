async function tagAllUsers() {
  try {
    const usersFound = await getUserNames();
    await typeUsers(usersFound);
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
          const userNames = userNamesText.split(", ");

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

async function typeUsers(usersFound) {
  try {
    const chatBox = document.querySelector(
      '[contenteditable="true"][data-tab="10"]'
    );

    if (chatBox) {
      for (let user of usersFound) {
        if (user === "Você") continue;

        console.log(`Tagging user: ${user}`);

        if (user.trim().startsWith("+")) {
          user = user.slice(0, -1);
        }

        chatBox.innerHTML = "";
        chatBox.focus();

        await new Promise((resolve) => setTimeout(resolve, 100));

        document.execCommand("insertText", false, `@${user}`);

        await new Promise((resolve) => setTimeout(resolve, 100));

        const ajzlElement = document.querySelector("._ajzl");
        if (ajzlElement) {
          ajzlElement.click();
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
      }
    }
    return;
  } catch (error) {
    console.log("Error to type users");
    return;
  }
}
