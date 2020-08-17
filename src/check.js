import { urls } from "./urls.js"

document.addEventListener("DOMContentLoaded", ev => {
    const submitCheck = (cid, type) => {
        let c = document.getElementById("checkin"),
                duration = c.querySelector('select[name="duration"]').value,
                hubid = location.hash.slice(1),
                url = urls.api.check + hubid
            // send a check in to the tracker
        fetch(url, {
          headers: new Headers({ "Content-Type": "application/json; charset=utf-8" }),
          method: 'post',
          body: JSON.stringify({
            type: type,
            duration: duration,
            user: cid
          })
        }).then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`)
            return response.json()
        }).then(data => {
            if (data.success) {
                showThanks(`<h2>Thank you for your check ${type}</h2>`)
            }
            else {
                m.innerHTML = `Sorry, check ${type} failed.`
                console.log("check reponse:", data)
            }
        })
    }, showCheckin = user => {
        // we have an id, show the check in/out form
        let cid = user.cid
        document.getElementById("known-user").classList.remove("hidden")
        document.checkout.onsubmit = ev => {
            ev.preventDefault()
            submitCheck(cid, "out")
        }
        document.checkin.onsubmit = ev => {
            ev.preventDefault()
            submitCheck(cid, "in")
        }
        document.getElementById("register-cid-link").addEventListener("click",
            ev => {
            document.getElementById("known-user").classList
                    .add("hidden")
            document.getElementById("checkin-cid").classList
                    .remove("hidden")
            return false
        })
        document.checkinCid.onsubmit = ev => {
            cid = document.getElementById("checkin-cid")
                          .querySelector('input[name="cid"]')
                          .value
            ev.preventDefault()
            submitCheck(cid, "in")
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
                n.classList.add("hidden")
                showThanks(`<h1>Thank you for registering</h1>
                            <h2>Your CID is ${d.cid}</h2>`)
            })
        }
    }, showThanks = msg => {
        Array.from(document.body.children).forEach(e => {
            if (e.id=="thanks")
                e.classList.remove("hidden")
            else
                e.classList.add("hidden")
        })
        document.getElementById("note").innerHTML = msg
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
