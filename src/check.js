import { urls } from "./urls.js"

document.addEventListener("DOMContentLoaded", ev => {
    const urlParams = new URLSearchParams(window.location.search)
    let uid = localStorage.getItem("cut-covid-id"),
        firstCheckin = localStorage.getItem("cut-covid-firstci")
    
    document.getElementById("loading").classList.add("hidden")

    if (uid) {
        // we have an id, show the check in/out form
        document.getElementById("known-user").classList.remove("hidden")
        if (firstCheckin) {
            document.getElementById("message").innerHTML = 
                "Thank you for signing up"
            firstCheckin = localStorage.removeItem("cut-covid-firstci")
        }
        document.checkin.onsubmit = ev => {
            ev.preventDefault()
            console.log("checkin")
            let c = document.getElementById("checkin"),
                three = c.querySelector('input[name="three"]').value,
                duration = c.querySelector('select[name="duration"]').value,
                hubid = location.hash.slice(1),
                url = urls.api.check + hubid
            // send a check in to the tracker
            fetch(url, {
              headers: new Headers({ "Content-Type": "application/json; charset=utf-8" }),
              method: 'post',
              body: JSON.stringify({
                type: "in",
                three: three,
                duration: duration,
                user: uid.slice(0,6)
              })
            }).then(response => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`)
                return response.json()
            }).then(data => {
                let m = document.getElementById("message")
                if (data.success) {
                    m.innerHTML = ""
                    document.getElementById("known-user").classList.add("hidden")
                    document.getElementById("thanks").classList.remove("hidden")
                }
                else {
                    m.innerHTML = "Sorry, check in failed."
                    console.log("check in reponse:", data)
                }
            })
        }
        document.getElementById("checkout-button").onclick = ev => {
        }
    } else {
        // no ID, show the registration page
        let n = document.getElementById("new-user")
        n.classList.remove("hidden")
        document.getElementById("register-button").onclick = ev => {
            let tel = n.querySelector('input[name="tel"]').value
            fetch(urls.api.register, {
              headers: new Headers({ "Content-Type": "application/json; charset=utf-8" }),
              method: 'POST',
              body: JSON.stringify({
                tel: tel
              })
            }).then(response => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`)
                return response.json()
            }).then(d => {
                localStorage.setItem("cut-covid-id", d.id)
                localStorage.setItem("cut-covid-firstci", true)
                location.reload()
            })
        }
    }
})
