import * as StandardAuth from './standardAuth.js';
import * as WebAuthn from './webAuthn.js';
import * as Helper from './helper.js';

/// Events for webAuthn.html
document.querySelector('button#webauthn-register-get-credman').addEventListener('click', (ev) => {
    StandardAuth.getFromCredManStore()
    .then(x => {
        document.querySelector('input#webauthn-register-name').value = x['id'];
    });
});

document.querySelector('button#webauthn-register').addEventListener('click', (ev) => {
    let userName = document.querySelector('input#webauthn-register-name').value;

    WebAuthn.register(userName).then(x => {
        let publicKey = Helper.preformatMakeCredReq(x);
        return navigator.credentials.create({ publicKey });
    }).then((newCred) => {
        console.log(newCred);
        let makeCredResponse = Helper.publicKeyCredentialToJSON(newCred);
        return WebAuthn.response(makeCredResponse);
    }).then((response) => {
        //console.log(response);
    });
});

document.querySelector('button#webauthn-login-get-credman').addEventListener('click', (ev) => {
    StandardAuth.getFromCredManStore()
    .then(x => {
        document.querySelector('input#webauthn-login-name').value = x['id'];
    });
});

document.querySelector('button#webauthn-login').addEventListener('click', (ev) => {
    resetLoginLabel();
    let userName = document.querySelector('input#webauthn-login-name').value;

    if(!userName) {
        setLoginLabel(false, "User angeben");
    }

    WebAuthn.login(userName).then(x => {
        let publicKey = Helper.preformatGetAssertReq(x);
        return navigator.credentials.get({publicKey});
    }).then(assertionResponse => {
        console.log(assertionResponse);
        let assertion = Helper.publicKeyCredentialToJSON(assertionResponse);
        return WebAuthn.response(assertion);
    }).then(response => {
        if(response['status'] === 'ok') {
            setLoginLabel(true, "Erfolgreich angemeldet");
        } else {
            setLoginLabel(false, "Anmeldung fehlgeschlagen");
        }
    }).catch(error => {
        setLoginLabel(false, "Anmeldung fehlgeschlagen");
    });
});

function resetLoginLabel() {
    let loginLabel = document.querySelector('label#login-verfied');
    loginLabel.classList.toggle('hidden', true);
    loginLabel.classList.toggle('success', false);
    loginLabel.classList.toggle('failed', false);
}
function setLoginLabel(success, text) {
    let loginLabel = document.querySelector('label#login-verfied');
    loginLabel.innerHTML = text;
    if(success){
        loginLabel.classList.toggle('success', true);
    } else {
        loginLabel.classList.toggle('failed', true);
    }
    loginLabel.classList.toggle('hidden', false);
}