require('dotenv').config();

const express = require('express');
const app = express();
const Twit = require('twit');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Twitter configurations
var twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  // Watson configurations
  var conversation = new ConversationV1({
    username: process.env.WATSON_SERVICE_USERNAME,
    password: process.env.WATSON_SERVICE_PASSWORD,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });

  var stream = twit.stream('user');
  stream.on('direct_message', function (directMsg) {
      const senderID = directMsg.direct_message.sender.id;
      const user_query = directMsg.direct_message.text;

      if (senderID !== 955665885607247900) {

        conversation.message(
            {
              input: { text: user_query },
              workspace_id: process.env.WATSON_SERVICE_WORKSPACE_ID,
            },
            function(err, response) {
              if (err) {
                console.log(err);
              } else {
                const reply = response.output.text[0];
                twit.post("direct_messages/new", {
                    user_id: 78918901,
                    text: reply
                });
              }
            }
          );

      }
    
  })

app.get('/', (req, res) => res.send('Twitter Watson Integration!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

