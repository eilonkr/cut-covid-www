import qrcode from 'qrcode-generator-es6'
import { urls } from "./urls.js"

// Registering our Service worker
// TODO: move the bundle to dist while keeping the scope global
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hub.sw.bundle.js', { scope: './' })
}

document.addEventListener("DOMContentLoaded", ev => {
    let id = localStorage.getItem("cut-covid-hubid")
    if (!id) {
        document.getElementById("register").classList.remove("hidden")
        document.registration.onsubmit = ev => {
        // Then we prevent the form from being sent by canceling the event

            ev.preventDefault()
            let type = document.getElementById("type"),
                other = document.getElementById("other")

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
                if (params.type == "other") {
                    params.type = params.other
                    delete params.other
                }
                fetch(urls.api.hub, {
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(params)
                }).then(response => {
                    if (!response.ok)
                        throw new Error(`HTTP error! status: ${response.status}`)
                    return response.json()
                }).then(d => {
                    localStorage.setItem("cut-covid-hubid", d.id)
                    location.reload()
                })
            }
        }
    } else {
        // 
        const   url = urls.web.check + id.slice(0,Math.min(id.length, 6)),
                sign = document.getElementById("sign"),
                short = document.getElementById("short-url")
        //TODO: shrinken the url
        short.setAttribute("href", url)
        short.innerHTML = url
        const qr = new qrcode(0, 'H');
        qr.addData(url);
        qr.make();
        document.getElementById("qrcode").innerHTML = qr.createSvgTag({cellSize:4})
        sign.querySelector("svg").setAttribute("width", "500")
        sign.classList.remove("hidden")
    }
})
