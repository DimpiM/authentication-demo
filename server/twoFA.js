const speakeasy = require('speakeasy');
var QRCode = require('qrcode');

const UserModel = require('./model/userModel.js');

exports.generateSecret = async (user) => {
    var secret = speakeasy.generateSecret({length: 20, name: 'blu Demo (' + user + ')'});
    console.log(secret);
    let twoFa = new UserModel.TwoFa(secret);
    let qrSecrete = await QRCode.toDataURL(secret.otpauth_url);
    return {
        twoFa: twoFa.toJson(),
        qrImage: qrSecrete
    };
}

exports.verify = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
      });
}