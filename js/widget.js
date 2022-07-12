let messageCallback = null
let ID = null

window.addEventListener("message", (event) => {
  let message = null
  try {
    message = JSON.parse(event.data)
  }
  catch (e) { }

  if (message) {
    if (message.type === "init") {
      ID = message.data
    }
    else if (message.type === "metadata") {
      let data = {}
      for (let key of message.data) {
        let tag = document.querySelector(`meta[name="${key}"]`)
        if (tag) {
          let value = tag.content
          if (!isNaN(value)) {
            value = Number(value)
          }

          data[key] = value
        }
      }

      sendMessage("metadata", data)
    }
    else if (message.type === "theme") {
      if (message.data === "light") {
        document.body.classList.add("light-theme")
      }
      else if (message.data === "dark") {
        document.body.classList.remove("light-theme")
      }

      if (messageCallback) {
        messageCallback(message)
      }
    }
    else if (messageCallback) {
      messageCallback(message)
    }
  }
})

function setMessageCallback(callback) {
  messageCallback = callback
}

function sendMessage(type, data) {
  if (!ID) {
    throw new Error("Widget not yet initialized by dashboard")
  }

  window.parent.postMessage(JSON.stringify({ id: ID, type: type, data: data }), "*")
}
