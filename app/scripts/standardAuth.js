export function test(ev) {
    console.log('test');
}

export function userRegistration(user, password) {
    return fetch('/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: user,
            password: password
        })
    })
    .then(response => response.json());
}

export function getUser(userName) {
    return fetch('/user?name=' + userName, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json());
}

export function updateUser(userName, twoFa) {
    return fetch('/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: userName,
            twoFa: twoFa
        })
    })
    .then(response => response.json());
}

export function saveToCredManStore(user) {
    if (window.PasswordCredential || window.FederatedCredential) {
        let pwCred = new PasswordCredential({
            'type': 'password',
            'id': user['name'],
            'password': user['password']
        }); 
        navigator.credentials.store(pwCred);
    }
}

export function getFromCredManStore() {
    if (window.PasswordCredential || window.FederatedCredential) {
        return navigator.credentials.get({ 'password': true });
    }
}

export function userLogin(user, password) {
    return fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: user,
            password: password
        })
    })
    .then(response => response.json());
}