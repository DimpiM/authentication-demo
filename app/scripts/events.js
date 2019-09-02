import * as StandardAuth from './standardAuth.js';
import * as Helper from './helper.js';

// Registration
document.querySelector('button#user-registration').addEventListener('click', (ev) => {    
    let user = document.querySelector('input#registration-name').value;
    let password = document.querySelector('input#registration-pw').value;
    StandardAuth.userRegistration(user, password)
    .then(x => {
        window.user = x;
    });
});

// Store via CredMan
document.querySelector('button#user-registration-store-credman').addEventListener('click', (ev) => {    
    let user = document.querySelector('input#registration-name').value;
    let password = document.querySelector('input#registration-pw').value;

    StandardAuth.saveToCredManStore(window.user);
});

// Get via CredMan
document.querySelector('button#user-login-get-credman').addEventListener('click', (ev) => {
    StandardAuth.getFromCredManStore()
    .then(x => {
        if(x) {
            document.querySelector('input#login-name').value = x['id'];
            document.querySelector('input#login-pw').value = x['password'];
        }
    });
});

// Login
document.querySelector('button#user-login').addEventListener('click', (ev) => {
    let user = document.querySelector('input#login-name').value;
    let password = document.querySelector('input#login-pw').value;

    StandardAuth.userLogin(user, password).then(x => {let loginLabel = document.querySelector('label#login-verfied');
        loginLabel.classList.toggle('hidden', false);
        loginLabel.classList.toggle('success', false);
        loginLabel.classList.toggle('failed', false);
        if(!Helper.isEmpty(x)) {
            loginLabel.innerHTML = "Erfolgreich angemeldet";
            loginLabel.classList.toggle('success', true);
        } else {
            loginLabel.innerHTML = "Anmeldung fehlgeschlagen";
            loginLabel.classList.toggle('failed', true);
        }
    });
});

