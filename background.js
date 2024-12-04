chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "checkGrammar",
      title: "Check Grammar",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "improveText",
      title: "Improve Text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "checkGrammar" || info.menuItemId === "improveText") {
      const command = info.menuItemId;
      const text = info.selectionText;
  
      // Send a message to content script
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: handleTextProcessing,
        args: [text, command]
      });
    }
  });
  
  // Function to handle grammar checking or text improvement
  async function handleTextProcessing(text, command) {
    const session = await chrome.aiOriginTrial.languageModel.create();
    let prompt = `Correct the grammar in this text: "${text}"`;
  
    if (command === "improveText") {
      prompt = `Rewrite the following text to improve clarity and style: "${text}"`;
    }
  
    const result = await session.prompt(prompt);
    session.destroy();
  
    chrome.runtime.sendMessage({ action: "updateText", result });
  }
 
  chrome.runtime.onStartup.addListener(async () => {
    const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
    if (capabilities.available === "after-download") {
      console.log("Downloading the language model...");
    } else if (capabilities.available === "no") {
      console.error("Language model is not available.");
    }
  });
  