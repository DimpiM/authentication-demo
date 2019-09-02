const routes = require('express').Router();
const path = require('path');

const base64url = require('base64url');

const standardAuth = require('./standardAuth.js');
const twoFA = require ('./twoFA.js');
const webAuthn = require ('./webAuthn.js');
const UserModel = require('./model/userModel.js');

routes.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../app/index.html'));
});

routes.get('/2fa', function (req, res) {
    res.sendFile(path.join(__dirname + '/../app/2fa.html'));
});

routes.get('/webauthn', function (req, res) {
    res.sendFile(path.join(__dirname + '/../app/webauthn.html'));
});

routes.post('/login', function (req, res) {
    var user = standardAuth.CheckLogin(req.body['user'], req.body['password']);
    res.send(user || {});
});
  
routes.get('/user', (req, res) => {
    let user = standardAuth.GetUser({name: req.query['name']});
    res.send(JSON.stringify(user || {}));
});

routes.post('/user', (req, res) => {
    let user = new UserModel.User({
        name: req.body['user'],
        password: req.body['password']
    });
    console.log(user);
    standardAuth.AddUser(user);
    res.send(JSON.stringify(user));
});

routes.put('/user', (req, res) => {
    console.log(req.body['twoFa'])
    let user = standardAuth.GetUser({name: req.body['name']});
    user['twoFa'] = new UserModel.TwoFa(req.body['twoFa']);
    standardAuth.UpdateUser(new UserModel.User(user));
    res.send(JSON.stringify(user));
});

routes.post('/2fa/generate', (req, res) => {
    twoFA.generateSecret(req.body['user']).then(x => {
        res.send(x);
    });    
});
routes.post('/2fa/verify', (req, res) => {
    let userName = req.body['userName'];
    let password = req.body['password'];
    let token = req.body['token'];
    let user = standardAuth.CheckLogin(userName, password);
    if(user) {
        let verified = twoFA.verify(user['twoFa']['base32'], token);
        console.log('verified: ' + verified);
        res.send(verified ? user : {}); 
    } else {
        res.send({});
    }
});

routes.post('/webauthn/register', (req, res) => {
    let userName = req.body['userName'];
    let user = standardAuth.GetUser({name: userName});

    let challengeMakeCred = webAuthn.generateServerMakeCredRequest(user['name'], user['id']);
    challengeMakeCred.status = 'ok';

    req.session['challenge'] = challengeMakeCred.challenge;
    req.session['username'] = user['name'];
    req.session['userid'] = user['id'];

    res.send(challengeMakeCred);
});

routes.post('/webauthn/login', (req, res) => {
    let userName = req.body['userName'];
    let user = standardAuth.GetUser({'name': userName});
    if(!user || user['webAuthn'] === {}) {
        res.send({});
    }
    let assertion = webAuthn.generateServerGetAssertion(user['webAuthn']);

    req.session['challenge'] = assertion.challenge;
    req.session['username'] = user['name'];
    req.session['userid'] = user['id'];

    res.send(assertion);
});

routes.post('/webauthn/response', (req, res) => {
    let webauthnResp = req.body['credResponse'];    
    let clientData = JSON.parse(base64url.decode(webauthnResp.response.clientDataJSON));
    console.log(clientData);

    /* Check challenge... */
    if(clientData.challenge !== req.session['challenge']) {
        res.send({
            'status': 'failed',
            'message': 'Challenges don\'t match!'
        })
    }

    let result;
    if(webauthnResp.response.attestationObject !== undefined) {
        result = webAuthn.verifyAuthenticatorAttestationResponse(webauthnResp);
        if(result.verified) {
            let user = standardAuth.GetUserById(req.session['userid']);
            user['webAuthn'].push(new UserModel.WebAuthn(result.authrInfo));
            standardAuth.UpdateUser(new UserModel.User(user));
        }
    } else if(webauthnResp.response.authenticatorData !== undefined) { 
        let user = standardAuth.GetUserById(req.session['userid']);
        result = webAuthn.verifyAuthenticatorAssertionResponse(webauthnResp, user['webAuthn']);
        console.log(result);
    } else {
        res.send({
            'status': 'failed',
            'message': 'Can not determine type of response!'
        });
    }


    if(result.verified) {
        req.session['loggedIn'] = true;
        res.send({'status': 'ok'});
    } else {
        res.send({
            'status': 'failed',
            'message': 'Can not authenticate signature!'
        });
    }
});


module.exports = routes;