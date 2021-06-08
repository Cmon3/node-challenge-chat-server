const express = require("express");
const cors = require("cors");
const { text } = require("express");

const app = express();

app.use(cors());
app.use(express.json())

const notPostingFunction = function (request, response, next) {
  if (request.body.from && request.body.text) {
    next()
    return
  } else {
    console.log("Nothing was sent!");
    response.sendStatus(400)
  }
}

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  timeSent: new Date()
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.post('/messages', notPostingFunction, function (request, response) {
  const message = {
    id: messages.length,
    from: request.body.from,
    text: request.body.text,
    timeSent: new Date(),
  }
  console.log(message);
  messages.push(message)
  response.send(message)
})

app.get('/messages', function (request, response) {
  response.json(messages);
})

app.get('/messages/search', function (request, response) {
  const text = request.query.text.toLowerCase();
  const matches = messages.filter(m => m.text.toLocaleLowerCase().includes(text))
  response.send(matches)
})

app.get('/messages/latest', function (request, response) {
  const latest = messages.slice(-10)
  response.send(latest)
})

app.get('/messages/:id', function(request, response) {
  const index = parseInt(request.params.id) - 1
  response.send(messages[index])
})

app.put('/messages/:id', function(request, response) {
  if (request.body.id || request.body.timeSent) {
    return response.sendStatus(400)
  }

  const messageIndex = messages.findIndex(m => m.id == indexMessage)
  
  if (messageIndex !== -1) {
    const newMessage = { ...messages[messageIndex], ...request.body }
    messages[messageIndex] = newMessage
    response.sendStatus(200)
  } else {
    response.sendStatus(400)
  }
})

app.delete('/messages/:id', function (request, response) {
  const indexMessage = request.params.id
  const message = messages.findIndex(m => m.id == indexMessage)
  messages.splice(indexMessage, 1)
  console.log(message);
  response.sendStatus(204)
})

/*function findMessagesContainingText(m, t) {
  let matches = []
  m.forEach(message => {
    if (message.text.includes(t)) {
      matches.push(message)
    }
  })
  return matches;
};*/

app.listen(3000, () => {
   console.log("Listening on port 3000")
  });
