const { Sequelize } = require("sequelize");
const db = require("../model/model.js");
const Op = db.Sequelize.Op;
const Practice = db.practices;
const path = require("path");
const fs = require("fs");

exports.create = (req, res) => {
	Practice.create(req.body)
		.then((data) => {
			var response = {
				status: "success",
				message: "A new user has been created !",
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

exports.getAllData = (req, res) => {
	Practice.findAll({
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
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};

exports.getMISReport = async (req, res) => {
	try {
		const {
			filter: { startDate = "", endDate = "" },
		} = req.body;
		const startDateTS = new Date(startDate);
		const endDateTS = new Date(endDate);
		const whereDateFilter = {
			...(startDate && endDate
				? {
						[Op.and]: [
							{
								createdAt: {
									[Op.gte]: startDateTS.toISOString(),
								},
							},
							{
								createdAt: {
									[Op.lte]: endDateTS.toISOString(),
								},
							},
						],
				  }
				: {}),
		};
		// const aggre = await Practice.findAll({
		//      attributes: {
		//          include: [[Sequelize.fn("COUNT", Sequelize.col("practice.service_type")), "ServiceTypeCount"]]
		//      },
		//      group: ['practice.service_type'],
		//      where: whereDateFilter
		// });
		const [practiceCount, practiceList] = await Promise.all([
			Practice.count({
				where: whereDateFilter,
			}),
			Practice.findAll({
				order: [["updated_at", "DESC"]],
				where: whereDateFilter,
			}),
		]);
		res.send({
			status: "success",
			result: { practiceCount, practiceList },
		});
	} catch (err) {
		console.log(err);
		var response = {
			status: "error",
			message: err.message,
		};
		res.send(response);
	}
};

exports.search = (req, res) => {
	Practice.findAll({
		where: {
			[Op.or]: [
				{
					name: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					email: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					email_1: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_person: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_number: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_person_1: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_number_1: { [Op.iLike]: `%${req.body.search}%` },
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
			console.log({ err });
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};

exports.filter = (req, res) => {
	Practice.findAll({
		where: {
			[Op.or]: [
				{
					country: { [Op.iLike]: `%${req.body.country}%` },
				},
				{
					state: { [Op.iLike]: `%${req.body.state}%` },
				},
				{
					city: { [Op.iLike]: `%${req.body.city}%` },
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
			console.log({ err });
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};

exports.upload = (req, res) => {
	const newpath = path.dirname(path.basename(__dirname)) + "/uploads/logo/";
	console.log("newpath", newpath)
	console.log("req.files", req.files)
	const file = req.files.file;
	if (!file){
		var response = {
			status: "error",
			message: "File not found"
		};
		return res.status(400).send(response);
	}
	const filename = Math.floor(Date.now() / 1000) + path.extname(file.name);
	console.log(newpath+filename)

	file.mv(`${newpath}${filename}`, (err) => {
		if (err) {
			console.log(err)
			res.status(500).send({ message: "File upload failed", code: 200 });
		} else {
			var response = {
				status: "success",
				imagePath: `uploads/logo/${filename}`,
			};
			res.send(response);
		}
	});
};

exports.getData = (req, res) => {
	const id = req.params.id;
	Practice.findByPk(id)
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
	var id = req.params.id;
	Practice.update(req.body, { where: { id: id } })
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

exports.getCustomer = (req, res) => {
	console.log("------------- Called -------------------");
	const { status } = req.query || {};
	console.log({ status });
	Practice.findAll({
		attributes: ["id", "name"],
		...(status === "true"
			? {
					where: {
						status: true,
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
			var response = {
				status: "error",
				message: err.message,
			};
			res.send(response);
		});
};
