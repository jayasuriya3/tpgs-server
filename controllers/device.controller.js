const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const Device = db.devices;

exports.create = async (req, res) => {
     await Device.create(req.body);
     Device.findAll({
               order: [
                    ['updated_at', 'DESC']
               ]
          })
          .then(data => {
               var response = {
                    status: "success",
                    message: "A new device has been created !",
                    result: data,
               }
               res.send(response);
          })

}

exports.get = (req, res) => {
     const { practiceAdminId } = req.query;
     Device.findAll({
          order: [
               ['updated_at', 'DESC']
          ],
          where: {
               ...(practiceAdminId
                    ? {
                         practice_admin_id: practiceAdminId,
                    }
                    : {}),
          },
     })
          .then(data => {
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

exports.update = (req, res) => {
     var id = req.params.id;
     Device.update(req.body, { where: { id: id } })
          .then(result => {
               var response = {
                    status: "success",
                    message: "Device updated successful!"
               }
               res.send(response);
          }).catch(err => {
               var response = {
                    status: "error",
                    message: err.message
               }
               res.send(response);
          })
}

exports.updateService = (req, res) => {
     var id = req.params.id;
     Device.update(req.body, { where: { id: id } })
          .then(result => {
               Device.findAll({
                    order: [
                         ['updated_at', 'DESC']
                    ]
               })
               .then(data  => {
                    var response = {
                         status: "success",
                         result: data,
                         message: "Device updated successful!",
                    }
                    res.send(response);
               })
          }).catch(err => {
               var response = {
                    status: "error",
                    message: err.message
               }
               res.send(response);
          })
}

exports.getDevice = (req, res) => {
     const id = req.params.id;
     Device.findByPk(id)
          .then(data => {
               var response = {
                    status: "success",
                    result: data,
               }
               res.send(response);
          })
          .catch(err => {
               var response = {
                    status: "error",
                    message: err.message
               }
               res.send(response);
          });
}