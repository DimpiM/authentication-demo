const webAuthn = require ('../webAuthn.js');

class User {
    constructor(options) {
        this.id = options['id'] || webAuthn.randomBase64URLBuffer();
        this.name = options['name'];
        this.password = options['password'];
        this.twoFa = options['twoFa'];
        this.webAuthn = options['webAuthn'];
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            twoFa: this.twoFa ? new TwoFa(this.twoFa).toJson() : {},
            webAuthn: this.webAuthn ? this.webAuthn : []
        }
    }
};

class TwoFa {
    constructor(options) {
        this.ascii = options['ascii'];
        this.hex = options['hex'];
        this.base32 = options['base32'];
        this.otpauth_url = options['otpauth_url'];
    }

    toJson() {
        return {
            ascii: this.ascii,
            hex: this.hex,
            base32: this.base32,
            otpauth_url: this.otpauth_url
        }
    }
}

class WebAuthnModel {
    constructor(options) {
        this.counter = options['counter'];
        this.credID = options['credID'];
        this.fmt = options['fmt'];
        this.publicKey = options['publicKey'];
    }

    toJson() {
        return {
            counter: this.counter,
            credID: this.credID,
            fmt: this.fmt,
            publicKey: this.publicKey
        }
    }
}

module.exports = {
    User: User,
    TwoFa: TwoFa,
    WebAuthn: WebAuthnModel
};