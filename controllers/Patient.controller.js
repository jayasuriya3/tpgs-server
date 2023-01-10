const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const Patient = db.patient;
const Kit = db.kit;

exports.create = async (req, res) => {
	try {
		const { kit_id: kitId } = req.body;
		const promises = [];
		if (kitId) {
			promises.push(
				Kit.update({ patientId: id }, { where: { id: kitId } })
			);
		}
		promises.push(Patient.create(req.body));
		await Promise.all(promises);
		var response = {
			status: "success",
			message: "A new Patient has been created !",
		};
		res.send(response);
	} catch (error) {
		console.log({ error });
		res.send({ error });
	}
};

exports.get = (req, res) => {
	const { physicianId, physicianAssitId, serviceStatus, isKitAssigned } =
		req.query || {};
	Patient.findAll({
		order: [["updated_at", "DESC"]],
		...(physicianAssitId || physicianId || serviceStatus || isKitAssigned
			? {
					where: {
						...(physicianId
							? {
									physician_id: physicianId,
							  }
							: {}),
						...(serviceStatus
							? {
									service_status: serviceStatus,
							  }
							: {}),
						...(isKitAssigned
							? {
									kit_id:
										isKitAssigned === "true"
											? {
													[Op.ne]: null,
											  }
											: null,
							  }
							: {}),
						...(physicianAssitId
							? {
									physician_assist_id: physicianAssitId,
							  }
							: {}),
					},
			  }
			: {}),
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

exports.getPatient = (req, res) => {
	const id = req.params.id;
	Patient.findByPk(id)
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

exports.update = (req, res) => {
	const id = req.params.id;
	const { kit_id: kitId } = req.body;
	if (kitId) {
		Kit.update({ patientId: id }, { where: { id: kitId } })
			.then(console.log)
			.catch(console.log);
	}
	Patient.update(req.body, { where: { id: id } })
		.then((result) => {
			var response = {
				status: "success",
				message: "Patient updated successful!",
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

exports.search = (req, res) => {
	Patient.findAll({
		where: {
			[Op.or]: [
				{
					name: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					phone_number: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					phone_number_alt: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					patientId: { [Op.iLike]: `%${req.body.search}%` },
				},
			],
		},
	})
		.then((result) => {
			var response = {
				status: "success",
				result: result,
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
