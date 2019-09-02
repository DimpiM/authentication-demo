import * as StandardAuth from './standardAuth.js';
import * as TwoFA from './2fa.js';
import * as Helper from './helper.js';

//// 2FA
// Get via CredMan
document.querySelector('button#user-login-get-credman').addEventListener('click', (ev) => {
    StandardAuth.getFromCredManStore()
    .then(x => {
        document.querySelector('input#secret-name').value = x['id'];
    });
});
// Generate Secret
document.querySelector('button#secret-generate').addEventListener('click', (ev) => {
    let userName = document.querySelector('input#secret-name').value;

    StandardAuth.getUser(userName).then(user => {
        if(!Helper.isEmpty(user)) {
            TwoFA.generateSecret(userName).then(qrSecret=> {
                StandardAuth.updateUser(userName, qrSecret['twoFa']).then(x => {
                    document.querySelector('img#qr-image').src = qrSecret['qrImage'];
                    document.querySelector('img#qr-image').classList.toggle('hidden', false);
                });
            });
        } else {
            document.querySelector('img#qr-image').classList.toggle('hidden', true)
        }
    });
});


// Get via CredMan
document.querySelector('button#secret-verify-get-credman').addEventListener('click', (ev) => {
    StandardAuth.getFromCredManStore()
    .then(x => {
        document.querySelector('input#secret-verify-name').value = x['id'];
        document.querySelector('input#secret-verify-pw').value = x['password'];
    });
});

document.querySelector('button#secret-verify-login').addEventListener('click', (ev) => {
    let userName = document.querySelector('input#secret-verify-name').value;
    let password = document.querySelector('input#secret-verify-pw').value;
    let token = document.querySelector('input#secret-verify-token').value;
    TwoFA.verify(userName, password, token).then(x => {
        let loginLabel = document.querySelector('label#login-verfied');
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