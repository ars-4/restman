const { ipcRenderer } = require('electron');

const tabs = document.querySelectorAll('.tab');
const form = document.querySelector('.form-group');
function activate_tab(e) {
    tabs.forEach(tab => {
        if (tab.classList.contains(e.target.innerHTML)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function openDevTools() {
    ipcRenderer.send('openDevTools');
}

function addHeader() {
    let header_parent = document.querySelector('.headers');
    let header = document.createElement('div');
    let header_name = document.createElement('input');
    header_name.placeholder = 'header';
    header_name.type = 'text';
    let header_value = document.createElement('input');
    header_value.placeholder = 'value';
    header_value.type = 'text';
    header.classList.add('input-group');
    header.classList.add('header');
    let remove = document.createElement('span');
    remove.innerHTML = '&times;';
    remove.style.cursor = "pointer";
    remove.addEventListener('click', removeNode);
    header.appendChild(header_name);
    header.appendChild(header_value);
    header.appendChild(remove);
    header_parent.insertBefore(header, header_parent.children[header_parent.children.length - 1]);
}
function removeNode(e) {
    e.target.parentNode.remove();
}
function getHeaders() {
    let headers_parent = document.querySelectorAll('.header');
    let headers = {};
    headers_parent.forEach(header => {
        if (header.children[0].value.length < 1) return;
        headers[header.children[0].value] = header.children[1].value
    })
    return headers;
}

function addParam() {
    let param_parent = document.querySelector('.params');
    let param = document.createElement('div');
    let param_name = document.createElement('input');
    param_name.placeholder = 'param';
    param_name.type = 'text';
    let param_value = document.createElement('input');
    param_value.placeholder = 'value';
    param_value.type = 'text';
    param.classList.add('input-group');
    param.classList.add('param');
    let remove = document.createElement('span');
    remove.innerHTML = '&times;';
    remove.style.cursor = "pointer";
    remove.addEventListener('click', removeNode);
    param.appendChild(param_name);
    param.appendChild(param_value);
    param.appendChild(remove);
    param_parent.insertBefore(param, param_parent.children[param_parent.children.length - 1]);
}
function getParams() {
    let params_parent = document.querySelectorAll('.param');
    let params = [];
    params_parent.forEach(param => {
        if (param.children[0].value.length < 1) return;
        params.push({
            name: param.children[0].value,
            value: param.children[1].value
        });
    })
    return params;
}

function serializeBody() {
    let textarea = document.querySelector('.body textarea').value;
    let body = ""
    if (textarea.length > 1) {
        body = JSON.parse(textarea);
    }
    return body;
}
function prettify() {
    let textarea = document.querySelector('.body textarea');
    let obj = JSON.parse(textarea.value);
    textarea.value = JSON.stringify(obj, undefined, 2);
}

async function submitRequest() {
    let headers = getHeaders();
    let params = getParams();
    let body = serializeBody();
    var response = null;
    const console_out = document.querySelector('.json-response');
    console_out.innerHTML = ``;

    switch (form.children[0].value) {

        case 'get':
            localStorage.setItem(localStorage.length, `GET - ${form.children[1].value}`);
            setHistory();
            await fetch(form.children[1].value, {
                method: 'GET',
                headers: headers
            }).then((res) => {
                if (!res.ok) {
                    console_out.innerHTML = `HTTP error! Status: ${res.status}`;
                }
                return res.json();
            })
                .then((data) => {
                    console_out.innerHTML = JSON.stringify(data, null, 2);
                }).catch(e => {
                    console_out.innerHTML = `${JSON.stringify(e, Object.getOwnPropertyNames(e))}`;
                    console.log(e);
                });
            break;

        case 'post':
            localStorage.setItem(localStorage.length, `POST - ${form.children[1].value}`);
            setHistory();
            await fetch(form.children[1].value, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            }).then((res) => {
                if (!res.ok) {
                    console_out.innerHTML = `HTTP error! Status: ${res.status}`;
                }
                return res.json();
            })
                .then((data) => {
                    console_out.innerHTML = JSON.stringify(data, null, 2);
                }).catch(e => {
                    console_out.innerHTML = `${JSON.stringify(e, Object.getOwnPropertyNames(e))}`;
                    console.log(e);
                });
            break;
        
        default:
            console_out.innerHTML = `Sorry right now only GET and POST works`;
            break;

    }


}


function setHistory() {
    let history = document.querySelector('.history');
    history.innerHTML = "";
    for (let i = 0; i < window.localStorage.length; i++) {
        let p = document.createElement('p');
        p.classList.add('history_item');
        p.innerHTML = `${localStorage.getItem(localStorage.key(i))}`
        p.addEventListener('click', () => {
            form.children[0].value = localStorage.getItem(localStorage.key(i)).split(' - ')[0].toLowerCase()
            form.children[1].value = localStorage.getItem(localStorage.key(i)).split(' - ')[1]
        })
        history.appendChild(p);
    }
}

function clearHistory() {
    window.localStorage.clear();
    setHistory();
}

document.addEventListener('DOMContentLoaded', () => {
    setHistory();
})