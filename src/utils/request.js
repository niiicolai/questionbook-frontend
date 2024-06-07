
let tokenManager=null;
export function setTokenManager(manager) {
    tokenManager = manager;
}

const serverUrl = import.meta.env.VITE_API_URL;

export default class Request {
    constructor({path, parseJson=true, stringifyBody=true, credentials=null, useAuth=false}) {
        this.path = `${serverUrl}${path}`;
        this.parseJson = parseJson;
        this.stringifyBody = stringifyBody;
        this.credentials = credentials;

        if (useAuth) {
            this.headers = {
                ...tokenManager.getHeaders(),
            };
        } else {
            this.headers = {};
        }
    }

    options(method, data=null) {
        const opt = {
            method: method,
            headers: this.headers,
        };
        if (this.credentials) {
            opt.credentials = this.credentials;
        }
        if (data && this.stringifyBody) {
            opt.body = JSON.stringify(data);
            opt.headers['Content-Type'] = 'application/json';
        } else if (data) {
            opt.body = data;
        }
        return opt;
    }

    async _fetch(method, data=null) {
        const opt = this.options(method, data);
        const response = await fetch(this.path, opt);
        
        if (this.parseJson) {
            return await response.json();
        } else {
            return response;
        }
    }

    async get() {
        return await this._fetch('GET');
    }

    async post(data) {
        return await this._fetch('POST', data);
    }

    async patch(data) {
        return await this._fetch('PATCH', data);
    }

    async put(data) {
        return await this._fetch('PUT', data);
    }

    async delete() {
        return await this._fetch('DELETE');
    }
}
