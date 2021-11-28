class App extends HTMLElement {

    constructor() {
        super();
        console.log("OK!");
    }

    connectedCallback() {
        console.log("connected!");
        let accessToken = this.getAttribute('data-access-token');
        let url = this.getAttribute('data-submit-uri')
        if (!accessToken) {
            this.innerHTML = "Provide valid 'data-access-token' attribute!";
        } else if (!url) {
            this.innerHTML = "Provide valid 'data-submit-uri' attribute!";
        } else {
            this.innerHTML = "" +
                "<form action='#' name='smart_home_form' id='smart_home_form'>" +
                " <label for='type'>Reading type:</label>" +
                " <select id='type' name='type' required='required'>" +
                "   <option value='' >---select one---</option>" +
                "   <option value='POWER_READING'>Power</option>" +
                "   <option value='GAS_READING'>Gas</option>" +
                "   <option value='HOME_WATER_READING'>Home Water</option>" +
                "   <option value='GARDEN_WATER_READING'>Garden Water</option>" +
                " </select>" +
                " <label for='readingDate'>Reading date:</label>" +
                " <input type='date' id='readingDate' name='readingDate' required>" +
                " <label for='value'>Value:</label>" +
                " <input type='number' id='value' name='value' required>" +
                " <input type='submit' value='SAVE'>" +
            "</form>" +
            "<div id='result-msg'></div>";

            this.addEventListener("submit", (e) => this.formSubmit(e, accessToken, url));
        }
    }

    disconnectedCallback() {
        this.removeEventListener("submit", this.formSubmit);
    }

    async formSubmit(evt, accessToken, url) {
        if (evt.target.name === 'smart_home_form') {
            evt.preventDefault();
            let rawForm = document.forms.namedItem(evt.target.name);
            let form = new FormData(rawForm);
            let data = {}
            for (let [key, value] of form.entries()) {
                data[key] = value
            }
            console.log(JSON.stringify(data));
            try {
                await this.submitReading(data, accessToken, url);
            } catch (e) {
                document.getElementById('result-msg').innerText = JSON.stringify(e);
            }
        }
    }


    async submitReading(data, accessToken, url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("POST", url);
            request.setRequestHeader('Authorization', accessToken);
            request.onload = (evt) => {
                if (this.status >= 200 && this.status < 300) {
                    resolve(request.response);
                } else {
                    reject(request.response);
                }
            }
            request.onerror = (evt) => {
                reject({ status: this.status, statusText: request.statusText });
            }
            request.send(data);
        });
    }
}

//if (window.customElements.get('my-app-element') === undefined) {
//  console.log("already loaded!");
//} else {
  console.log("loading custom element!");
  window.customElements.define('my-app-element', App);
//}
console.log("loaded!");
