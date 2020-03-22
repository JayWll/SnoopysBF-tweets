const time = require('time')
const twit = require('twit')
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get("/sendtweet", (req, res) => {
  // Check that the expected key has been included with the web request
  if (!req.headers['auth-key'] || req.headers['auth-key'] != process.env.AUTH_KEY) {
    return res.status(401).send('Authorization header not found').end();
  }
  
  // Get the current time, in Calgary
  const now = new time.Date()
  now.setTimezone('America/Edmonton')
  
  // If it's before 7am or after 10pm, stop here
  if (now.getHours() < 7 || now.getHours > 21) return res.status(200).send('Shhh. Charlie Brown is sleeping.').end()
  
  // Pick a random number from 0 to 54. If it isn't 0, stop here
  if (randomInt(0, 54) != 0) return res.status(200).send('This dog has nothing to say.').end()
  
  // Construct a tweet of 1 to 5 words
  var text = ''
  const words = randomInt(1, 5)
  
  // Loop through the number of words and append either "woof" or "bark" with a 50/50 probability
  for (var i = 0; i < words; i++) {
    if (randomInt(0, 1) == 0) text += 'woof'
    else text += 'bark'
    
    // If we're not on the last word, add a space or a comma
    if (i != (words - 1)) {
      if (randomInt(0, 6) < 6) text += " "
      else text += ", "
    }
  }
  
  // Capitalize the first letter of the tweet
  text = text.charAt(0).toUpperCase() + text.slice(1)
  
  // Add a final piece of puntuation at the end, either a period or an exclamation mark
  if (randomInt(0, 6) < 6) text += "."
  else text += "!"
  
  // Create our connection to the twitter API
  const tweet = new twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  })
  
  // Send the tweet!
  tweet.post('statuses/update', { status: text }, (err, data, response) => {
    res.status(200).send(text).end()
  })
})

// Function to return a random integrer between 'min' and 'max'
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Start the app!
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
});
