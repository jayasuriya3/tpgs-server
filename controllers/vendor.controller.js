const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const Vendor = db.vendors;

function pad(n, width) {
     n = n + '';
     return n.length >= width ? n :
          new Array(width - n.length + 1).join('0') + n;
}

exports.create = (req, res) => {

     Vendor.create(req.body)
          .then(data => {
               var genratedVendorId = pad(data.dataValues.id, 6);
               Vendor.update({ vendor_id: genratedVendorId }, { where: { id: data.dataValues.id } })
                    .then(result => {
                         Vendor.findAll({
                              order: [
                                   ['updated_at', 'DESC']
                              ]
                         })
                              .then(allData => {
                                   var response = {
                                        status: "success",
                                        message: "A new Vendor has been created !",
                                        result: allData,
                                   }
                                   res.send(response);
                              })
                    })
          })
          .catch(err => {
               res.status(200).send({
                    status: "error",
                    message: err.message
               });
          });


}

exports.get = (req, res) => {
     const { practiceAdminId } = req.query;
     Vendor.findAll({
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

exports.getVendor = (req, res) => {
     const id = req.params.id;
     Vendor.findByPk(id)
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

exports.updateVendor = (req, res) => {
     var id = req.params.id;
     Vendor.update(req.body, { where: { id: id } })
          .then(result => {
               Vendor.findAll({
                    order: [
                         ['updated_at', 'DESC']
                    ]
               })
               .then(data  => {
                    var response = {
                         status: "success",
                         result: data,
                         message: "Vendor updated successful!",
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
     Vendor.findAll({
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

