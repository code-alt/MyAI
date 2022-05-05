const express = require("express");
const app = express();
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.static(__dirname));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var autokey = "auto";
app.get("/getres", async (req, res) => {
    if (req.query.key && req.query.prompt && req.query.key !== autokey) {
        await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', { 
            method: 'post', 
            headers: {
              'Authorization': 'Bearer '+req.query.key, 
              'Content-Type': 'application/json'
            },
            body: {
                "prompt": "Say this is a test",
                "max_tokens": 5,
                "temperature": 1,
                "top_p": 1,
                "n": 1,
                "stream": false,
                "logprobs": null,
                "stop": "\n"
              }
          }).then(async (response) => {
              if (response.status==401){return res.send("Invalid API Key")}else{
                    var infotopass = await new OpenAIApi(new Configuration({
                  apiKey: req.query.key
              })).createCompletion("text-davinci-002", {
                  prompt: req.query.prompt,
                  temperature: 0.7,
                  max_tokens: 2048
              });
              res.send(infotopass.data.choices[0].text);
            }
          });
    } else if (req.query.prompt || req.query.prompt && req.query.key==autokey) {
        var infotopass = await openai.createCompletion("text-davinci-002", {
            prompt: req.query.prompt,
            temperature: 0.7,
            max_tokens: 512,
        });
        res.send(infotopass.data.choices[0].text);
    } else {
        res.send("You need a Prompt.");
    }
});

async function getInfo(i) {
const response = await openai.createCompletion("text-davinci-002", {
    prompt: i,
    temperature: 0.7,
    max_tokens: 512,
});
return response.data.choices[0].text;
}



app.listen(process.env.PORT || 3000);