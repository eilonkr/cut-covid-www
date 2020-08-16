import { urls } from "./urls.js"


document.addEventListener("DOMContentLoaded", ev => {
    const showCheckin = (user) => {
        // we have an id, show the check in/out form
        const cid = user.cid
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
                duration = c.querySelector('select[name="duration"]').value,
                hubid = location.hash.slice(1),
                url = urls.api.check + hubid
            // send a check in to the tracker
            fetch(url, {
              headers: new Headers({ "Content-Type": "application/json; charset=utf-8" }),
              method: 'post',
              body: JSON.stringify({
                type: "in",
                duration: duration,
                user: cid
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
    }, showRegister = () => {
        // show the registration page
        let n = document.getElementById("new-user")
        n.classList.remove("hidden")
        document.register.onsubmit = ev => {
            let phone = n.querySelector('input[name="phone"]').value,
                three = n.querySelector('input[name="three"]').value,
                name = n.querySelector('input[name="name"]').value
            ev.preventDefault()
            // register the user and store the returned data
            fetch(urls.api.register, {
              headers: new Headers({ "Content-Type": "application/json; charset=utf-8" }),
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify({
                name:  name,
                personal_id: three,
                phone: phone
              })
            }).then(response => {
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`)
                return response.json()
            }).then(d => {
                localStorage.setItem("cut-covid-id", JSON.stringify(d))
                localStorage.setItem("cut-covid-firstci", true)
                n.classList.add("hidden")
                showCheckin(d)
            })
        }
    }
    const urlParams = new URLSearchParams(window.location.search)

    let id = localStorage.getItem("cut-covid-id"),
        firstCheckin = localStorage.getItem("cut-covid-firstci")

    
    document.getElementById("loading").classList.add("hidden")

    if (id) {
        showCheckin(JSON.parse(id))
    } else {
        showRegister()
    }
})
