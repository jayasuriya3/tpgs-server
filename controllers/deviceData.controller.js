const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const DeviceData = db.deviceData;

exports.get = (req, res) => {
    const { practiceAdminId, deviceListId = '' } = req.query;
    const deviceListIdArr = deviceListId.split(',').filter(Boolean);
    DeviceData.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            ...(practiceAdminId
                ? {
                    practice_admin_id: practiceAdminId,
                }
                : {}),
            ...(deviceListIdArr.length > 0
                ? {
                    id: {
                        [Op.in]: deviceListIdArr,
                    },
                }
                : {}),
        }
    }).then(data => {
        var response = {
            status: "success",
            result: data,
        }
        res.send(response);
    })
        .catch(err => {
            res.status(200).send({
                status: "error",
                message: err.message
            });
        });
}

module.exports.AddDevice = async (req, res) => {
    try {
        console.log("body data", req.body)
        const existingDevice = await DeviceData.findAll({
            where: {
                serviceId: req.body.serviceId,
                accessoryId: req.body.accessoryId,
                vendorId: req.body.vendorId,
                deviceId: req.body.deviceId
            }
        });
        console.log("existing device", existingDevice)
        if (existingDevice.length) {

            return res.status(403).send({
                message: "Device Already Exist",
            });
        }
        const device = await DeviceData.create(req.body);
        res.send({
            status: "success",
            message: "Service based added successfully"
        });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};

module.exports.AddGeneralDevice = async (req, res) => {
    try {
        const existingDevice = await DeviceData.findAll({
            where: {
                deviceId: req.body.deviceId
            }
        });
        console.log("existing device", existingDevice)
        if (existingDevice.length) {
            return res.status(403).send({
                message: "Device Already Exist",
            });
        }
        const device = await DeviceData.create(req.body);
        res.send({
            status: "success",
            message: "General Service based added successfully"
        });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};

module.exports.getViewDevice = async (req, res, next) => {
    try {
        console.log("req,body", req.params)
        if (req.params.accessory === "Mobile") {
            console.log("reached")
            const device = await DeviceData.findAll({
                where: {
                    vendorName: req.params.vendor,
                    accessoryName: req.params.accessory
                },
                order: [['deviceId', 'ASC']]
            });
            res.send(device);
        }
        else {
            const device = await DeviceData.findAll({
                where: {
                    vendorId: req.params.vendorId,
                    serviceId: req.params.serviceId,
                    accessoryId: req.params.accessoryId
                },
                order: [['deviceId', 'ASC']]
            });
            console.log("device", device)
            res.send(device);
        }

    } catch (error) {
        return next({ status: 404, message: error });
        res.status(400).send(error);
        console.log(error);
    }
};

module.exports.deviceDetailUpdate = async (req, res) => {
    try {
        console.log(req.body);
        const device = await DeviceData.update(req.body,
            { where: { id: req.params.id } }
        );
        console.log("device",device)
        res.send({ msg: "Accessory Edited Successful", success: true });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};