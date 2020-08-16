# cut-covid-www

All the UI parts of cut-covid are in this repo. They are written in plain ES6
with no frameworks and very few dependecies. For now the parts are:

- Hub's progressive web app
- Check in/out form
- User's registration form

## Developing

Fir you need to install the dependecies using `npm i` and then build the js
bundle using `npm run build`.

To see it in a browser you'll need a simple http server. The easiest way is
to `python3 -m http.server` and then http://127.0.0.1:8000 will show a list
of the project's files. you can either click `hub.html` to see the hub app
or `check.html` to get the checkin form.

## User Scenarios

The main scenario starts at the entry to each hub with is a printed page with
the hub's unique URL encoded as a QR code and a shortened url. The url is of
the form `/hub/<hub_id>` and leads to one of to pages:

### Check IN/Check Out

If it's not the user's first report, he'll get a page where he can either 
check in or check out. After clicking the users get a thank you and a short
virus update. 

### Register

First timers have to add their phone number.
The number will only be used to text users when the code discovers
they were in close contact with infected people.
Upon entering their phone, the code creates a unique ID for the user and stores
it in the browser's local storage. This ID will be used to identify the user in
all future interactions.

## Hub Registration

Our home page invites business managers to register their place as a hub. 
When they click the register button they are asked to install our PWA.
Upon lunching the app they'll be presented with a form where they
enter the hub's name, type, address and the manager's phone & email. 
After filling the form, the code creates a new hub-id and redirects the 
manager to page with his unique QR code and a short url. The user
is expected to print the page and hang it at the entries to his place.

## Attribuitions

Our icon was copied from [freepik](https://www.flaticon.com/authors/freepik)
may they live long and prosper.
