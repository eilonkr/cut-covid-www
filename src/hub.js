
const   TRACKER_URL     = "http://example.com",
        REGISTER_URL    = "http://example.com"

// Registering our Service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hub.sw.bundle.js', { scope: './' })
}

document.addEventListener("DOMContentLoaded", ev => {
    document.registration.onsubmit = ev => {
    // Then we prevent the form from being sent by canceling the event
        let type = document.registration.querySelector('select[name="type"]'),
            other = document.registration.querySelector('input[name="other"]')

        if ((type.value == "other") && (!other.value)) {
            document.getElementById("message").innerHTML = 
                "Please enter the business type"
            other.dispatchEvent(invalid)
            ev.preventDefault()
        } else
            document.getElementById("message").innerHTML = ""
    }
})
