require('dotenv').config()
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");

const { client_id, client_secret, redirect_uris, refresh_token } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/status", async (req, res) => {
  res.status(200).send('tá funcionando eim');
});

app.post("/create-calendar", async (req, res) => {
  try {
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris);

    oAuth2Client.setCredentials({ refresh_token });

    const result = await calendar.calendars.insert({
      requestBody: req.body,
      auth: oAuth2Client,
    });

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
});


app.post("/create-event", async (req, res) => {
  try {
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris);

    oAuth2Client.setCredentials({ refresh_token });

    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: req.body,
      auth: oAuth2Client,
    });

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
});

//get future event for given email: 'q: req.body.q'
app.post("/get-events", async (req, res) => {
  try {
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris);
    oAuth2Client.setCredentials({ refresh_token });
  
    const result = await calendar.events.list({
      calendarId: req.body.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: req.body.maxResults,
      q: req.body.q,
      //maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      auth: oAuth2Client,
      //fields: 'items(attendees/email)'
    });

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
});

app.post("/get-all-events", async (req, res) => {
  try {
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris);
    oAuth2Client.setCredentials({ refresh_token });
  
    const result = await calendar.events.list({
      calendarId: req.body.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: req.body.maxResults,
      q: req.body.q,
      //maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      auth: oAuth2Client,
      //fields: 'items(attendees/email)'
    });

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
});

//get all events from the given calendar
/* app.post("/get-all-events", async (req, res) => {
  try {

    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    
    const result = await calendar.events.list({
      calendarId: req.body.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: req.body.maxResults,
      //maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      auth: auth,
    });

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
}); */

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
