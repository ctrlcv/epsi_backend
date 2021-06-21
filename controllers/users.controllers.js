const Users = require('./../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./../config/dev');
const Utils = require('./../service/utils');

exports.signIn = async function(req, res, next) {
    const { userid, password } = req.body;
    if (!userid || !password) {
        return res.status(422).json({ 
            success: false, 
            message: "아이디와 비밀번호를 입력하세요." 
        });
    }

    try {
        let findUser = await Users.findUser(userid);
        if (findUser.length === 0) {
            return res.status(423).json({ 
                success: false, 
                message: "존재하지 않는 사용자입니다."
            });
        }

        const isMatch = await bcrypt.compare(password, findUser[0].Password);
        if (!isMatch) {
            return res.status(424).json({ 
                success: false,
                message: "비밀번호가 올바르지 않습니다."
            });
        }

        const payload = {
            id: findUser[0].Id,
            userid: findUser[0].User_id,
            username: findUser[0].User_name,
            auth: findUser[0].Auth
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 7);

        let refreshExpiresdate = new Date();
        refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);

        const refreshToken = await jwt.sign(payload, config.secretOrRefreshKey, {expiresIn: '30d'});
        const token = await jwt.sign(payload, config.secretOrKey, {expiresIn: '7d'});

        if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
            return res.status(200).json({
                success: true,
                message: "User successfully authenticated",
                id: findUser[0].Id,
                userid: findUser[0].User_id,
                username: findUser[0].User_name,
                auth: findUser[0].Auth,
                accesstoken: token,
                expiresdate: expiresdate.getTime(),
                refreshtoken : refreshToken,
                refreshexpiresdate: refreshExpiresdate.getTime()
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.signUp = async function(req, res, next) {
    const { userid, password, username, auth } = req.body;

    if (!userid || !password) {
        return res.status(422).json({ 
            success: false,
            message: "아이디와 비밀번호를 입력하세요." 
        });
    }

    try {
        let findUser = await Users.findUser(userid);
        if (findUser.length > 0) {
            return res.status(423).json({ 
                success: false, 
                message: "이미 등록된 User Id 입니다."
            });
        }

        let hash = await bcrypt.hash(password, 10);

        let newUser = await Users.createUser(userid, username, hash, auth);

        console.log(newUser);

        if (!Utils.isEmpty(newUser)) {
            return res.status(200).json({
                success: true,
                result: newUser
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getToken = async function(req, res, next) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token

        if (Utils.isEmpty(clientToken)) {
            return res.status(403).json({
                success: false,
                message: 'not logged in at getToken'
            })
        }

        const decoded = await jwt.verify(clientToken, config.secretOrRefreshKey);

        if (Utils.isEmpty(decoded)) {
            return res.status(402).json({ 
                success: false,
                message: 'unauthorized' 
            });
        }

        let decidedId = decoded.id;
        let decidedUserid = decoded.userid;
        let decidedUsername = decoded.username;
        let decidedAuth = decoded.auth;

        const payload = {
            id: decidedId,
            userid: decidedUserid,
            username: decidedUsername,
            auth: decidedAuth
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 7);

        let refreshExpiresdate = new Date();
        refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);

        const refreshToken = await jwt.sign(payload, config.secretOrRefreshKey, {expiresIn: '30d'});
        const token = await jwt.sign(payload, config.secretOrKey, {expiresIn: '7d'});

        if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
            return res.status(200).json({
                success: true,
                message: "token successfully updated",
                accesstoken: token,
                expiresdate: expiresdate.getTime(),
                refreshtoken : refreshToken,
                refreshexpiresdate: refreshExpiresdate.getTime()
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getAccessToken = async function(req, res, next) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token

        if (Utils.isEmpty(clientToken)) {
            return res.status(403).json({
                success: false,
                message: 'not logged in at getToken'
            })
        }

        const decoded = await jwt.verify(clientToken, config.secretOrRefreshKey);

        if (Utils.isEmpty(decoded)) {
            return res.status(402).json({ 
                success: false,
                message: 'unauthorized' 
            });
        }

        let decidedId = decoded.id;
        let decidedUserid = decoded.userid;
        let decidedUsername = decoded.username;
        let decidedAuth = decoded.auth;

        const payload = {
            id: decidedId,
            userid: decidedUserid,
            username: decidedUsername,
            auth: decidedAuth
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 7);

        const token = await jwt.sign(payload, config.secretOrKey, {expiresIn: '7d'});
        if (!Utils.isNull(token)) {
            res.status(200).json({
                success: true,
                message: "token successfully updated",
                accesstoken: token,
                expiresdate: expiresdate.getTime()
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getUserInfo = async function(req, res, next) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token
       
        if (Utils.isEmpty(clientToken)) {
            return res.status(403).json({
                success: false,
                message: 'not logged in at getToken'
            })
        }

        const decoded = await jwt.verify(clientToken, config.secretOrKey);

        if (Utils.isEmpty(decoded)) {
            return res.status(402).json({ 
                success: false,
                message: 'unauthorized' 
            });
        }

        let userid = decoded.userid;

        let findUser = await Users.findUser(userid);
        if (findUser.length === 0) {
            return res.status(423).json({ 
                success: false, 
                message: "존재하지 않는 사용자입니다."
            });
        }

        const payload = {
            id: findUser[0].Id,
            userid: findUser[0].User_id,
            username: findUser[0].User_name,
            auth: findUser[0].Auth
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 7);

        let refreshExpiresdate = new Date();
        refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);

        const refreshToken = await jwt.sign(payload, config.secretOrRefreshKey, {expiresIn: '30d'});
        const token = await jwt.sign(payload, config.secretOrKey, {expiresIn: '7d'});

        if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
            return res.status(200).json({
                success: true,
                message: "User successfully authenticated",
                id: findUser[0].Id,
                userid: findUser[0].User_id,
                username: findUser[0].User_name,
                auth: findUser[0].Auth,
                accesstoken: token,
                expiresdate: expiresdate.getTime(),
                refreshtoken : refreshToken,
                refreshexpiresdate: refreshExpiresdate.getTime()
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.updateUser = async function(req, res, next) {
    const { id, userid, password, newpassword, username, auth} = req.body;
    if (!userid || !password) {
        return res.status(422).json({ 
            success: false, 
            message: "이메일과 비밀번호를 입력하세요." 
        });
    }

    try {
        let findUser = await Users.findUser(userid);
        if (findUser.length === 0) {
            return res.status(423).json({ 
                success: false, 
                message: "존재하지 않는 사용자입니다."
            });
        }

        const isMatch = await bcrypt.compare(password, findUser[0].Password);
        if (!isMatch) {
            return res.status(424).json({ 
                success: false,
                message: "비밀번호가 올바르지 않습니다."
            });
        }

        let newhash = await bcrypt.hash(newpassword, 10);

        let updateUser = await Users.updateUser(id, userid, username, newhash, auth);
        console.log(updateUser);

        if (Utils.isEmpty(updateUser)) {
            return res.status(424).json({
                success: false, 
                message: "updateError"
            });
        }

        if (!Utils.isEmpty(username)) {
            const payload = {
                id: updateUser[0].Id,
                userid: userid,
                username: username,
                auth: auth
            };
    
            let expiresdate = new Date();
            expiresdate.setDate(expiresdate.getDate() + 7);
    
            let refreshExpiresdate = new Date();
            refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);
    
            const refreshToken = await jwt.sign(payload, config.secretOrRefreshKey, {expiresIn: '30d'});
            const token = await jwt.sign(payload, config.secretOrKey, {expiresIn: '7d'});

            if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
                return res.status(200).json({
                    success: true,
                    message: "User successfully authenticated",
                    id: updateUser[0].Id,
                    userid: userid,
                    username: username,
                    auth: auth,
                    accesstoken: token,
                    expiresdate: expiresdate.getTime(),
                    refreshtoken : refreshToken,
                    refreshexpiresdate: refreshExpiresdate.getTime()
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

