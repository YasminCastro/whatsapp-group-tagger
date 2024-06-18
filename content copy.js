function init() {
  openGroupParticipants();
}

init();

function openGroupParticipants() {
  try {
    const groupTitle = document.querySelector(
      'header div[role="button"] span[title]'
    );

    groupTitle.click();

    setTimeout(checkAndClickSeeAll, 2000);
  } catch (error) {
    console.log("ERROR", error);
  }
}

function checkAndClickSeeAll() {
  const seeAllDivs = document.querySelectorAll(
    "div._alzk div._alzn span.x1lkfr7t.xdbd6k5.x1fcty0u.xw2npq5 div.x1iyjqo2.x1yc453h.x1n68mz9"
  );

  let seeAllButton = null;
  seeAllDivs.forEach((div) => {
    if (div.textContent.includes("Ver tudo")) {
      seeAllButton = div;
    }
  });

  if (seeAllButton) {
    seeAllButton.click();
    console.log('"Ver tudo" encontrado e clicado.');
    setTimeout(collectAllGroupParticipants, 2000);
  } else {
    console.log('"Ver tudo" não encontrado.');
    collectAllGroupParticipants();
  }
}

function collectAllGroupParticipants() {
  // Seleciona todos os elementos que podem conter o nome dos participantes
  const participantElements = document.querySelectorAll(
    'div[role="listitem"] div._ak8n div._aou8._aj_h span[title]'
  );
  let participantsNames = [];

  console.log(
    "Elementos de participantes encontrados:",
    participantElements.length
  );

  participantElements.forEach((participant) => {
    const name = participant.getAttribute("title");
    console.log("Nome encontrado:", name);
    if (name) {
      participantsNames.push(name);
    }
  });

  if (participantsNames.length > 0) {
    console.log("Participantes do grupo encontrados:", participantsNames);
    tagAllParticipants(participantsNames);
  } else {
    console.log("Nenhum participante encontrado.");
  }
}

function tagAllParticipants(participantsNames) {
  let messageBox = document.querySelector('div[contenteditable="true"]');

  if (messageBox) {
    let tagMessage = participantsNames.map((name) => `@${name}`).join(" ");
    messageBox.textContent = tagMessage;
    console.log("Mensagem de marcação criada:", tagMessage);

    // Simular o envio da mensagem (apenas se necessário)
    const event = new InputEvent("input", { bubbles: true });
    messageBox.dispatchEvent(event);
  } else {
    console.log("Caixa de mensagem não encontrada.");
  }
}
