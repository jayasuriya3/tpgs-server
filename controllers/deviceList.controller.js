const db = require("../model/model.js");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const Op = db.sequelize;
const DeviceList = db.deviceLists;
const DeviceDetail = db.deviceDetails;
const Vendor = db.vendors;
const Device = db.devices;
const Accessory = db.accessorys;

exports.getList = async (req, res) => {
	const { practiceAdminId } = req.query;
	const VendorNameList = await Vendor.findAll({
		where: {
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		}
	});
	const DeviceNameList = await Device.findAll({
		where: {
			status: true, 
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		}
	});
	const AccessoryNameList = await Accessory.findAll({
		where: {
			is_activity: true, 
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		},
	});
	var response = {
		status: "success",
		VendorNameList: VendorNameList,
		DeviceNameList: DeviceNameList,
		AccessoryNameList: AccessoryNameList,
	};
	res.send(response);
};

exports.addDeviceBased = (req, res) => {
	DeviceList.create(req.body)
		.then((data) => {
			var response = {
				status: "success",
				message: "Added successful!",
			};
			res.send(response);
		})
		.catch((err) => {
			res.status(200).send({
				status: "error",
				message: err.message,
			});
		});
};

exports.addDeviceGeneral = async (req, res) => {
	DeviceDetail.create(req.body).then((data) => {
		var response = {
			status: "success",
			message: "Added successful!",
		};
		res.send(response);
	});
};

exports.getGeneral = (req, res) => {
	DeviceDetail.findAll({
		order: [["updated_at", "DESC"]],
	})
		.then((data) => {
			var response = {
				status: "success",
				result: data,
			};
			res.send(response);
		})
		.catch((err) => {
			res.status(200).send({
				status: "error",
				message: err.message,
			});
		});
};

exports.deleteGeneral = (req, res) => {
	var id = req.params.id;
	DeviceDetail.destroy({ where: { id: id } })
		.then((result) => {
			DeviceDetail.findAll({
				order: [["updated_at", "DESC"]],
			}).then((data) => {
				var response = {
					status: "success",
					result: data,
					message: "A record removed successful!",
				};
				res.send(response);
			});
		})
		.catch((err) => {
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};

exports.upload = (req, res) => {
	const newpath = path.dirname(path.basename(__dirname)) + "/uploads/";
	const file = req.files.file;
	const filename = Math.floor(Date.now() / 1000) + ".csv";
	var queryArray = new Array();
	file.mv(`${newpath}${filename}`, (err) => {
		if (err) {
			res.status(500).send({ message: "File upload failed", code: 200 });
		} else {
			fs.createReadStream(`${newpath}${filename}`)
				.pipe(parse({ delimiter: ",", from_line: 2 }))
				.on("data", function (row) {
					var query = {
						accessory_type: req.body.accessory_type,
						manuf_name: row[0],
						model: row[1],
						serial_no: row[2],
						purchase_date: row[3],
						warranty: row[4],
						warranty_type: row[5],
						mobile_no: row[6],
						sim_serial_no: row[7],
						service_provider: row[8],
						service_type: row[9],
						service_plan: row[10],
					};
					queryArray.push(query);
				})
				.on("end", async function () {
					await DeviceDetail.bulkCreate(queryArray)
						.then((data) => {
							DeviceDetail.findAll({
								order: [["updated_at", "DESC"]],
							})
								.then((data) => {
									var response = {
										status: "success",
										message:
											"New Records created successful!",
										result: data,
									};
									res.send(response);
								})
								.catch((err) => {
									var response = {
										status: "error",
										message: err.message,
									};
									res.send(response);
								});
						})
						.catch((err) => {
							var response = {
								status: "error",
								message: err.message,
							};
							res.send(response);
						});
				});
		}
	});
};

exports.getDeviceList = async (req, res) => {
     const { deviceListId = '', practiceAdminId  } = req.query || {};
     const deviceListIdArr = deviceListId.split(',').filter(Boolean);
	 console.log( { deviceListIdArr });
     const [results, metadata] = await Op.query(
		`SELECT 
          "devices"."name" AS "Device", 
          "vendors"."name" AS "Vendor", 
          "accessories"."name" AS "Accessory",
          "accessories"."type" AS "AccessoryType",
          "deviceLists"."is_available" AS "Available",
          "deviceLists"."device_id" AS "DeviceId", 
          "deviceLists"."vendor_id" AS "VendorId", 
          "deviceLists"."accessory_id" AS "AccessoryId", 
          "deviceLists"."modified_by" AS "Modified_by",
          "deviceLists"."updated_at" AS "Updated_at",
          "deviceLists".*
          FROM "deviceLists"  
          INNER JOIN "devices" ON "deviceLists"."device_id" = "devices"."id"
          INNER JOIN "vendors" ON "deviceLists"."vendor_id" = "vendors"."id"
          INNER JOIN "accessories" ON "deviceLists"."accessory_id" = "accessories"."id" ${deviceListIdArr.length ? 'WHERE "deviceLists"."id" IN(:deviceListIdArr) AND "deviceLists"."practice_admin_id" = :practiceAdminId' 
		  : ' WHERE "deviceLists"."practice_admin_id" = :practiceAdminId'}`,
          {
               replacements: { deviceListIdArr, practiceAdminId },
          }
	);

	const devicesData = [];
	results.map((elm)=>{
		devicesData.push(elm);
	})

	const [results1, metadata1] = await Op.query(
		`SELECT 
		  "deviceDetails"."accessory_type"	AS "AccessoryType",
          "deviceDetails"."updated_at" AS "Updated_at",
          "deviceDetails".*
          FROM "deviceDetails"`
	);

	results1.map((elm)=>{
		devicesData.push(elm);
	})

	// const DeviceDetailList = await DeviceDetail.findAll();

	devicesData.sort(function(a,b){
		return new Date(b.Updated_at) - new Date(a.Updated_at);
	});

	var response = {
		status: "success",
		result: devicesData,
	};
	res.send(response);
};

exports.getDeviceListById = async (req, res) => {
     try {
          
          const { deviceId, vendorId, accessoryId, status = 'available'  } = req.query || {};
          const [results, metadata] = await Op.query(
               `SELECT 
               "devices"."name" AS "Device", 
               "vendors"."name" AS "Vendor", 
               "accessories"."name" AS "Accessory",
               "accessories"."type" AS "AccessoryType",
               "deviceLists"."is_available" AS "Available",
               "deviceLists"."device_id" AS "DeviceId", 
               "deviceLists"."vendor_id" AS "VendorId", 
               "deviceLists"."accessory_id" AS "AccessoryId", 
               "deviceLists"."modified_by" AS "Modified_by",
               "deviceLists"."updated_at" AS "Updated_at",
               "deviceLists".*
               FROM "deviceLists" 
               INNER JOIN "devices" ON "deviceLists"."device_id" = "devices"."id"
               INNER JOIN "vendors" ON "deviceLists"."vendor_id" = "vendors"."id"
               INNER JOIN "accessories" ON "deviceLists"."accessory_id" = "accessories"."id" WHERE "deviceLists"."device_id" = :deviceId AND "deviceLists"."vendor_id" = :vendorId AND "deviceLists"."accessory_id" = :accessoryId AND "deviceLists"."is_available" = :status LIMIT 1;`,
               { replacements: { status, vendorId, accessoryId, deviceId } }
          );
          var response = {
               status: "success",
               result: results,
          };
          res.send(response);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               status: "error",
               message: error.message,
          });
     }
};

exports.getDeviceDetail = (req, res) => {
	DeviceList.findAll({ where: req.body })
		.then((data) => {
			var response = {
				status: "success",
				result: data,
			};
			res.send(response);
		})
		.catch((err) => {
			res.status(200).send({
				status: "error",
				message: err.message,
			});
		});
};

exports.update = (req, res) => {
	var id = req.params.id;
	DeviceList.update(req.body, { where: { id: id } })
		.then((result) => {
			var response = {
				status: "success",
				message: "User updated successful!",
			};
			res.send(response);
		})
		.catch((err) => {
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};
