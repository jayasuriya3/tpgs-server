const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const Accessory = db.accessorys;

exports.create = async (req, res) => {
     await Accessory.create(req.body);
     Accessory.findAll({
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
     Accessory.findAll({
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

exports.getAccessory = (req, res) => {
     const id = req.params.id;
     Accessory.findByPk(id)
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

exports.update = (req, res) => {
     var id = req.params.id;
     Accessory.update(req.body, { where: { id: id } })
          .then(result => {
               var response = {
                    status: "success",
                    message: "Accessory updated successful!"
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

exports.updateAccessory = (req, res) => {
     var id = req.params.id;
     Accessory.update(req.body, { where: { id: id } })
          .then(result => {
               Accessory.findAll({
                    order: [
                         ['updated_at', 'DESC']
                    ]
               })
               .then(data  => {
                    var response = {
                         status: "success",
                         result: data,
                         message: "Accessory updated successful!",
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

exports.search = (req, res) => {
     Accessory.findAll({
          where: {
               name: { [Op.iLike]: `%${req.body.search}%` },
          }
     })
          .then(result => {
               var response = {
                    status: "success",
                    result: result,
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

