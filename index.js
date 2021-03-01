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

app.post("/get-events", async (req, res) => {
  try {
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris);

    oAuth2Client.setCredentials({ refresh_token });

    const result = await calendar.events.list({
      calendarId: req.body.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    //calendar.events.list({
    //  calendarId: 'primary',
    //  timeMin: (new Date()).toISOString(),
    //  maxResults: 10,
    //  singleEvents: true,
    //  orderBy: 'startTime',
    //}

    res.status(200).send(result);
  } catch (e) {
    console.log({ e });
    res.status(500).send({ e });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
