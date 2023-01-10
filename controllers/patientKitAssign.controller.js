const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const patientKitAssign = db.patientKitAssign;

exports.create = async (req, res) => {
    try {
        await patientKitAssign.create(req.body);
        var response = {
             status: "success",
             message: "A new patientKitAssign has been created !",
        }
        res.send(response);
    } catch (error) {
        res.send({ error })
    }
}

exports.get = (req, res) => {
    patientKitAssign.findAll({
          order: [
               ['updated_at', 'DESC']
          ],
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

exports.getPatient = (req, res) => {
     const id = req.params.id;
     patientKitAssign.findByPk(id)
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
     patientKitAssign.update(req.body, { where: { id: id } })
          .then(result => {
               var response = {
                    status: "success",
                    message: "patientKitAssign updated successful!"
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

