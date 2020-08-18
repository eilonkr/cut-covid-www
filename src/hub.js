import qrcode from 'qrcode-generator-es6'
import { urls } from "./urls.js"

// Registering our Service worker
// TODO: move the bundle to dist while keeping the scope global
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hub.sw.bundle.js', { scope: './' })
}

document.addEventListener("DOMContentLoaded", ev => {
    const showRegister = () => {
        let stage = 0,
            zones = 3
        document.getElementById("register").classList.remove("hidden")
        document.getElementById("add-zone").onclick = ev => {
            let e = document.createElement("div")

            zones++
            e.classList.add("pure-control-group")
            e.innerHTML = `<label for="zone${zones}1">Zone ${zones} name:</label>
                    <input id="${zones}" name="${zones}" size="20" default="${zones}" />`
            document.getElementById("zones").appendChild(e)
        }
        document.registration.onsubmit = ev => {
            ev.preventDefault()
            // If business ttye is other ensure that other is specified
            let type = document.getElementById("type"),
                other = document.getElementById("other")
            if ((type.value == "other") && (!other.value)) {
                //  TODO: Find a way to add the error msg under the other field
                document.getElementById("message").innerHTML = 
                    "Please enter the business type"
                other.dispatchEvent(invalid)
                return
            } 
            // if multizone show the second stage of the form
            
            if (document.getElementById("multizone").checked && (stage == 0)) {
                document.registration.children[0].classList.add("hidden")
                document.registration.children[1].classList.remove("hidden")
                stage++
                return 
            }
            // validate zonning & its other
            if (stage == 1) {
                let zoning = document.getElementById("zoning"),
                    other = document.getElementById("zoning-other")
                if ((zoning.value == "other") && (!other.value)) {
                    document.getElementById("message").innerHTML = 
                        "Please enter the zonning type"
                    other.dispatchEvent("invalid")
                    return
                } 
            }
            document.getElementById("message").innerHTML = ""
            
            // build and opject from form elements
            let params = {}
            Array.from(document.registration.elements).forEach(e => {
                if ((e.name) && (e.value) && (e.name != "multizone"))
                    if (e.name.slice(0,4) == "zone") {
                        if (params.zones == undefined)
                            params.zones = []
                        params.zones.push(e.value)
                    } else
                        params[e.name] = e.value
            })
            // "other" special cases
            if (params.type == "other") {
                params.type = params.other
            }
            if (params.zoning == "other") {
                params.type = params.zoningOther
            }
            delete params.other
            delete params.zoningOther
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
                localStorage.setItem("cut-covid-hubid", JSON.stringify(d))
                document.getElementById("register").classList.add("hidden")
                showSign(d)
            })
        }
    }, showSign = (hub) => {
        // 
        const   url = urls.web.check + hub.id,
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
    let id = localStorage.getItem("cut-covid-hubid")
    if (!id)
        showRegister()
    else 
        showSign(JSON.parse(id))
})
