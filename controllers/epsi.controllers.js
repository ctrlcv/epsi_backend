const Epsi = require('./../models/epsi.model');
const config = require('./../config/dev');
const Utils = require('./../service/utils');

exports.getGroupCode = async function(req, res, next) {
    try {
        let groupCode = await Epsi.getGroupCode();
        if (Utils.isEmpty(groupCode)) {
            return res.status(434).json({
                success: false,
                message: "Group Codes are Empty"
            });
        }
        return res.status(200).json({
            success: true,
            result: groupCode
        });
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getMaterialCode = async function(req, res, next) {
    try {
        let materialCode = await Epsi.getMaterialCode();
        if (Utils.isEmpty(materialCode)) {
            return res.status(434).json({
                success: false,
                message: "Material Codes are Empty"
            });
        }
        return res.status(200).json({
            success: true,
            result: materialCode
        });
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getTypeCode = async function (req, res, next) {
    try {
        let typeCode = await Epsi.getTypeCode();
        if (Utils.isEmpty(typeCode)) {
            return res.status(434).json({
                success: false,
                message: "Type Codes are Empty"
            });
        }
        return res.status(200).json({
            success: true,
            result: typeCode
        });
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

exports.getEpsiData = async function(req, res, next) {
    const { lat, lon } = req.body;

    try {
        let typeCode = await Epsi.getEpsiData(lat, lon);
        if (Utils.isEmpty(groupCode)) {
            return res.status(434).json({
                success: false,
                message: "EPSI data are Empty"
            });
        }
        return res.status(200).json({
            success: true,
            result: typeCode
        });
    } catch (err) {
        console.error(err);
        return res.status(434).json({
            success: false,
            message: "Error",
            error: err
        });
    }
}

