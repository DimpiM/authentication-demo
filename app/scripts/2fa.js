export function generateSecret(user) {
    return fetch('/2fa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: user
        })
    })
    .then(response => response.json());
}

export function verify(userName, password, token) {
    return fetch('/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: userName,
            password: password,
            token: token
        })
    })
    .then(response => response.json());
}