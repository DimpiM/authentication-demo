const fs = require('fs');

const UserModel = require('./model/userModel.js');

exports.test = function() {
    return {'fooXXX': 'barXX'};
}

exports.GetUser = (user) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    let storedUser = users.find(x => x['name'] === user['name']);
    return storedUser;
}

exports.GetUserById = (userId) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    let storedUser = users.find(x => x['id'] === userId);
    return storedUser;
}

exports.AddUser = (user) => {
    let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    users.push(user.toJson());
    fs.writeFileSync('users.json', JSON.stringify(users));
}

exports.UpdateUser = (user) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    let filterdUsers = users.filter(x => x['id'] !== user['id']);
    filterdUsers.push(user.toJson());
    fs.writeFileSync('users.json', JSON.stringify(filterdUsers));
}

exports.CheckLogin = (user, password) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    let storedUser = users.find(x => x['name'] === user);
    if(storedUser) {
        return storedUser['password'] === password ? storedUser : null;
    }
    return null;
}