// import * as qrcode from 'qrcode'
// import { toDataURL } from 'qrcode'

const   HUBS_URL     = "http://54.72.200.116:5000/hub",
        CHECK_IN_URL = "http://54.72.200.116:7000/hub/"

// Registering our Service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hub.sw.bundle.js', { scope: './' })
}

document.addEventListener("DOMContentLoaded", ev => {
    document.registration.onsubmit = ev => {
    // Then we prevent the form from being sent by canceling the event
        let type = document.getElementById("type"),
            other = document.getElementById("other")

        ev.preventDefault()
        if ((type.value == "other") && (!other.value)) {
            document.getElementById("message").innerHTML = 
                "Please enter the business type"
            other.dispatchEvent(invalid)
        } else {
            let params = {}
            document.getElementById("message").innerHTML = ""
            Array.from(document.registration.elements).forEach(e => {
                if ((e.name) && (e.value))
                    params[e.name] = e.value
            })
            // TODO: upgrade the backend so it can get "other"

            fetch(HUBS_URL, {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(params)
            }).then(response => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`)
                var b = response.json()
                console.log(b)
                return b
            }).then(d => {
                let u = CHECK_IN_URL + d.id.slice(0,6)
                localStorage.setItem("cut-covid-hubid", d.id)
                document.getElementById("short-url").innerHTML = u
                debugger
                /*
                qrcode.toDataURL(u)
                      .then(url => document.getElementById("qr-img").src = url)
                      */
            })
        }
    }
})
