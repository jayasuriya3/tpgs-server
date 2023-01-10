const db = require("../model/model.js");
const seqOp = db.sequelize;
const Op = db.Sequelize.Op;
const Kit = db.kit;
const DeviceData = db.deviceData;

exports.create = async (req, res) => {
	try {
		await Kit.create(req.body);
		console.log(req.body.deviceListIds)
		const deviceList = req.body.deviceListIds
		if (deviceList && deviceList.length > 0) {
			for (var i = 0; i < deviceList.length; i++) {
				let device = await DeviceData.update({ deviceStatus: "Assigned" },
					{ where: { id: deviceList[i] } }
				);
			}
		}
		var response = {
			status: "success",
			message: "A new Kit has been created !",
		};
		res.send(response);
	} catch (error) {
		res.send({ error });
	}
};

exports.get = async (req, res) => {
	try {
		const { isAssigned } = req.query;
		let displayData = [];
		if (isAssigned === 'True') {
			const [results, metadata] = await seqOp.query(
				`SELECT 
				   "patients"."name" AS "patientName", 
				   "patients"."device_name" AS "patientDeviceName", 
				   "patients"."device_id" AS "patientDeviceId", 
				   "kits".*
				   FROM "kits" 
				   INNER JOIN "patients" ON "kits"."patientId" = "patients"."id"
				   ${isAssigned ? isAssigned === 'True' ? 'WHERE "kits"."patientId" IS NOT NULL ORDER BY "kits"."updated_at" DESC;' : 'WHERE "kits"."patientId" IS NULL ORDER BY "kits"."updated_at" DESC;' : 'ORDER BY "kits"."updated_at" DESC'}`
			);
			displayData = results;
		}
		else {
			const [results, metadata] = await seqOp.query(
				`SELECT 
				   "kits".*
				   FROM "kits"
				   WHERE "kits"."patientId" IS NULL ORDER BY "kits"."updated_at" DESC;`
			);
			displayData = results;
		}
		const response = {
			status: "success",
			result: displayData,
		};
		res.send(response);
	} catch (err) {
		console.log(err);
		res.status(200).send({
			status: "error",
			message: err.message,
		});
	}
};

exports.getPatient = (req, res) => {
	const id = req.params.id;
	Kit.findByPk(id)
		.then((data) => {
			var response = {
				status: "success",
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
};

exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		const deletedList = req.body.deletedDeviceList
		const availableList = req.body.deviceListIds
		const state = {
			deviceListIds: req.body.deviceListIds,
			modified_by: req.body.modified_by
		}
		if(deletedList.length > 0){
			for (var i = 0; i < deletedList.length; i++) {
				let device = await DeviceData.update({ deviceStatus: null },
					{ where: { id: deletedList[i] } }
				);
			}
		}
		const unassignedDevices = await DeviceData.findAll({
			where: {
				[Op.or]: [{ deviceStatus: null }, { deviceStatus: "Working" }],
				...(availableList.length > 0
					? {
						id: {
							[Op.in]: availableList,
						},
					}
					: {}),
			}
		})

		if(unassignedDevices && unassignedDevices.length > 0){
			for (var i = 0; i < unassignedDevices.length; i++) {
				let device = await DeviceData.update({ deviceStatus: "Assigned" },
					{ where: { id: unassignedDevices[i] } }
				);
			}
		}
		
		await Kit.update(state, { where: { id: id } })
		var response = {
			status: "success",
			message: unassignedDevices,
		};
		res.send(response);
	}
	catch (error) {
		var response = {
			status: "error",
			message: err.message,
		};
		res.status(400).send(response);
	}
};
