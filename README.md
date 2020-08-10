# open-chains

## A server &amp; PWA that helps the people track virus transmission chains.

We've started this project because we  belief that working together is the best
modus operandi to contain the virus. If we check in at hubs and report when we
tested positive we can quickly break the transmission chains by texting people
telling them they should get tested and minimize social interactions until they
get a negative result.

## Entry Path

At the entry to each hub there is a printed page with the hub's unique URL
encoded as a QR code and a shortened url. The url is of the form
`/hub/<hub_id>` and leads to one of to pages:

### Check IN/Check Out

If it's not the user's first report, he'll get a page where he can either 
check in or check out. After clicking the users get a thank you and a short
virus update. 

### Register

First timers have to add their phone number.
The number will only be used to text users when open-chains discovers
they were in close contact with infected people.
Upon filling the phone, open-chain creates a unique ID for the user and stores
it in the browser's local storage. This ID will be used to identify the user in
all future interactions.

## Hub Registration

Our home page invites business managers to register their place as a hub. 
When they click the register button they are directed to a form where they
enter their place name, type, address and the manager's phone & email. 
After filling the form, open-chains creates a new hub-id and redirects the 
manager to page with his unique QR code and short url. The user
is expected to print the page and hang it at the entries to his place.
