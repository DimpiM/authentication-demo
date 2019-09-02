export function register(userName) {
    return fetch('/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: userName
        })
    })
    .then(response => response.json());
}

export function response(credResponse) {
    return fetch('/webauthn/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credResponse: credResponse
        })
    })
    .then(response => response.json());
}

export function login(userName) {
    return fetch('/webauthn/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: userName
        })
    })
    .then(response => response.json());
}