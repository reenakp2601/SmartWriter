chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateText") {
      const userSelection = window.getSelection();
      const range = userSelection.getRangeAt(0);
  
      // Replace text and style
      const span = document.createElement("span");
      span.textContent = message.result; // Corrected text
      span.style.backgroundColor = "yellow";
      span.title = "Click to accept correction";
      span.addEventListener("click", () => {
        range.deleteContents();
        range.insertNode(document.createTextNode(message.result));
      });
  
      range.deleteContents();
      range.insertNode(span);
    }
  });
  