class App extends HTMLElement {

    constructor() {
        super();
        console.log("OK!");


    }

    async connectedCallback() {
        this.innerHTML = "<b>" + "await this.foo()" + "</b>"
    }

    async foo() {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open("GET", "https://google.com");
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(request.response);
                } else {
                    reject(request.response);
                }
            }
            request.onerror = function () {
                reject({ status: this.status, statusText: request.statusText });
            }
            request.send();
        });
    }


}

window.customElements.define('my-app-element', App);
console.log("loaded!");
