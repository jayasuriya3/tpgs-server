const db = require("../model/model.js");
const seqOp = db.sequelize;
const Op = db.Sequelize.Op;
const User = require("../models").User;
const CustomerAssign = db.customerAssign;
const Practices = db.practices;
const AssistantAssign = db.assistantAssigns;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("-+-");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode"); 
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
// const dateFormat = require('dateformat');
const moment = require('moment')

exports.login = (req, res) => {
	var currentPassword = req.body.password;
	var userInf = req.body.email;
	var updateIpQuery = {
		ip_address: req.body.ipAddress,
		is_activity: true,
	};
	console.log("userInf", userInf)
	User.findAll({
		where: {
			[Op.or]: [{ username: userInf }, { email: userInf }],
		},
	})
		.then((data) => {
			console.log("data",data)
			console.log(data[0].dataValues.password);
			console.log(cryptr.decrypt(data[0].dataValues.password));
			savedPassword = cryptr.decrypt(data[0].dataValues.password);
			if (savedPassword == currentPassword) {
				const token = jwt.sign(
					{ id: data[0].dataValues.id, email: data[0].dataValues.email, role: data[0].dataValues.role },
					process.env.ACCESS_TOKEN_SECRET,
					{
					  expiresIn: "1d",
					}
				  );
				User.update(updateIpQuery, {
					where: {
						email: data[0].dataValues.email,
					},
				})
					.then((result) => {
						const returnData = {
							status: "success",
							message: "Login Success.",
							userRole: data[0].dataValues.role,
							userId: data[0].dataValues.id,
							practiceId: data[0].dataValues.practiceId,
							userName: data[0].dataValues.username,
							userEmail: data[0].dataValues.email,
							isTOTP: !!data[0].dataValues.totpAuthUrl,
							token: token
						};
						res.send(returnData);
					})
					.catch((err) => {
						var response = {
							status: "error",
							message: err.message,
						};
						res.send(response);
					});
			} else {
				const returnData = {
					status: "passwordError",
					message: "Login Failed. Please confirm your info again.",
				};
				res.send(returnData);
			}
		})
		.catch((err) => {
			console.log({ err });
			res.status(200).send({
				status: "error",
				message: "Can't find user info!",
			});
		});
};

exports.logout = (req, res) => {
	console.log(req.body.email);
	const Query = {
		is_activity: false,
	};
	User.update(Query, { where: { email: req.body.email } })
		.then((result) => {
			var response = {
				status: "success",
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

exports.generateTOTPQR = async (req, res) => {
	try {
		const { email } = req.body;
		const existingUser = await User.findOne({ where: { email } });
		let totpAuthUrl;
		let totpSecret;
		if (!existingUser) {
			throw new Error("INVALID EMAIL");
		}
		if (existingUser.totpSecret && existingUser.totpAuthUrl) {
			({ totpSecret, totpAuthUrl } = existingUser);
		} else {
			const secret = speakeasy.generateSecret({
				name: `TOTP-secret:${email}`,
			});
			totpAuthUrl = secret.otpauth_url;
			totpSecret = secret.ascii;
		}
		QRCode.toDataURL(totpAuthUrl, async function (err, data_url) {
			if (err) {
				throw err;
			}
			console.log(data_url);
			if (!existingUser.totpSecret) {
				await User.update(
					{
						totpSecret,
						totpAuthUrl,
					},
					{ where: { email } }
				);
			}
			const response = {
				status: "success",
				QRCode: data_url,
			};
			res.send(response);
		});
	} catch (error) {
		console.log(error);
		const response = {
			status: "error",
			message: error.message,
		};
		res.status(500).json(response);
	}
};

exports.verifyTOTPCode = async (req, res) => {
	try {
		const { email, code } = req.body;
		const existingUser = await User.findOne({ where: { email } });
		let totpSecret;
		if (!existingUser) {
			throw new Error("INVALID EMAIL");
		}
		if (existingUser.totpSecret) {
			({ totpSecret } = existingUser);
		} else {

			throw new Error("TOTP is not enabled for this account");
		}
		const tokenValidate = speakeasy.totp.verify({
			secret: totpSecret,
			encoding: "ascii",
			token: code,
		});
		const response = {
			status: "success",
			tokenValidate
		};
		res.send(response);
	} catch (error) {
		console.log(error);
		const response = {
			status: "error",
			message: error.message,
		};
		res.status(500).json(response);
	}
};

exports.create = (req, res) => {
	req.body.password = cryptr.encrypt(req.body.password);
	User.create(req.body)
		.then((data) => {
			var response = {
				status: "success",
				message: "A new user has been created !",
			};
			res.send(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(200).send({
				status: "error",
				message: err.message,
			});
		});
};

exports.getAllData = (req, res) => {
	const { userType, status, practiceAdminId } = req.query;
	console.log({ userType });
	User.findAll({
		order: [["created_at", "DESC"]],
		where: {
			...(userType
				? {
					user_type: userType,
				}
				: {}),
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		},
	})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.getAccessLog = (req, res) => {
	const { userType, status, practiceAdminId } = req.query;
	console.log({ userType });
	User.findAll({
		order: [["updated_at", "DESC"]],
		where: {
			ip_address: { [Op.not]: null },
			...(userType
				? {
					user_type: userType,
				}
				: {}),
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		},
	})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.getData = (req, res) => {
	const id = req.params.id;
	User.findByPk(id)
		.then((data) => {
			try {
				data.dataValues.password = cryptr.decrypt(
					data.dataValues.password
				);
			} catch (error) {
				console.log(error);
			}
			res.send(data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.getCustomerAssignedIds = async (req, res) => {
	try {
		const { assigned_id, targetRole, type } = req.query;
		const result = await CustomerAssign.findOne({
			where: {
				...(assigned_id ? { assigned_id } : {}),
				...(type ? { type } : {}),
			},
		});
		const { referenceIds = [], ...rest } = result || {};
		let assignedIds = [];
		await CustomerAssign.findAll({
			where: {
				...(type ? { type } : {})
			}
		}).then((result) => {
			result.map((data) => {
				data.referenceIds.map((dat) => {
					assignedIds.push(dat);
				})
			})
		})
		const targetRoles = targetRole ? targetRole.split(',') : null;
		console.log({ referenceIds, rest, type });
		let findAssignedUser = [];
		let findNotAssignedUser = [];

		switch (type) {
			case "USER": {
				findAssignedUser = await User.findAll({
					where: {
						id: {
							[Op.in]: referenceIds,
						},
						...(targetRoles
							? {
								role: {
									[Op.in]: targetRoles
								}
							}
							: {}),
					},
				});
				findNotAssignedUser = await User.findAll({
					where: {
						...(targetRoles
							? {
								role: {
									[Op.in]: targetRoles
								},
							}
							: {}),
						id: {
							// [Op.notIn]: referenceIds,
							[Op.notIn]: assignedIds,
						},
					},
				});
				break;
			}
			case "PRACTICE": {
				findAssignedUser = await Practices.findAll({
					where: {
						id: {
							[Op.in]: referenceIds,
						}
						//role: "practice",
					},
				});
				findNotAssignedUser = await Practices.findAll({
					where: {
						id: {
							// [Op.notIn]: referenceIds,
							[Op.notIn]: assignedIds,
						}
						//role: "practice",
					},
				});
				break;
			}

			default:
				break;
		}
		res.send({
			status: "success",
			notAssigned: findNotAssignedUser,
			assigned: findAssignedUser,
			referenceIds,
			...rest,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: err.message,
		});
	}
};

exports.customerAssign = async (req, res) => {
	try {
		const { type, referenceIds, assigned_id } = req.body;
		if (req.body.deleted_id) {
			const linkedData = await CustomerAssign.destroy({
				where: { assigned_id: req.body.deleted_id, type }
			});
		}
		const dateNow = new Date().toISOString();
		const previousUsers = await CustomerAssign.findOne({
			where: { assigned_id, type }
		});
		if (previousUsers != null) {
			const unAssignedUsers = previousUsers.referenceIds.filter(x => !referenceIds.includes(parseInt(x)));
			const resultDestroy = await CustomerAssign.destroy({
				where: {
					assigned_id: {
						[Op.in]: unAssignedUsers,
					},
					type: type
				},
			});
		}
		const result = await CustomerAssign.update(
			{
				type,
				referenceIds,
				assigned_id,
				createdAt: dateNow,
				updatedAt: dateNow,
			},
			{ where: { assigned_id, type } }
		);

		if (result.length && !result[0]) {
			await CustomerAssign.create({
				type,
				referenceIds,
				assigned_id,
				createdAt: dateNow,
				updatedAt: dateNow,
			});
		}
		res.send({
			status: "success",
			message: "A new user assign has been created !",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: err.message,
		});
	}
};

exports.resetPassword = (req, res) => {
	var id = req.params.id;
	var decimal =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

	if (req.body.newPass !== req.body.confirmPass) {
		var response = {
			status: "error",
			message: "Don't match Password!",
		};
		res.send(response);
		return;
	}

	if (!req.body.newPass.match(decimal)) {
		var response = {
			status: "error",
			message: "Enter the stronger password.",
		};
		res.send(response);
		return;
	}

	const Sql = {
		password: cryptr.encrypt(req.body.newPass),
		modified_by: req.body.modified_by,
	};

	User.update(Sql, { where: { id: id } })
		.then((reslut) => {
			User.findAll({
				order: [["updated_at", "DESC"]],
			}).then((data) => {
				var response = {
					status: "success",
					result: data,
					message: "Password updated successful!",
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

exports.update = (req, res) => {
	var id = req.params.id;
	if (req.body.password) {
		req.body.password = cryptr.encrypt(req.body.password);
	}
	User.update(req.body, { where: { id: id } })
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

exports.validateUsernameContact = async (req, res) => {
	try {
		const checkUsername = await User.findOne({
			where: {
				username: req.body.username
			}
		})
		if (checkUsername) {
			return res.status(400).send({
				message: "Username already in use!",
			});
		}

		const checkContactNumber = await User.findOne({
			where: {
				contact_number: req.body.contact_number
			}
		})
		if (checkContactNumber) {
			return res.status(400).send({
				message: "Contact Number already in use!",
			});
		}

		res.status(200).send({
			message: "New user",
		});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({
			message: err.message,
		});
	}
}

exports.search = (req, res) => {
	User.findAll({
		where: {
			[Op.or]: [
				{
					name: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					email: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					username: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					role: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					user_type: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					practice: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_person: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_number: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					location: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					ip_address: { [Op.iLike]: `%${req.body.search}%` },
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

exports.searchAccessLog = (req, res) => {
	User.findAll({
		where: {
			ip_address: { [Op.not]: null },
			[Op.or]: [
				{
					name: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					email: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					username: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					role: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					user_type: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					practice: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_person: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					contact_number: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					location: { [Op.iLike]: `%${req.body.search}%` },
				},
				{
					ip_address: { [Op.iLike]: `%${req.body.search}%` },
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

// exports.searchFilter = (req, res) => {
// 	console.log(req.body?.fromDate);

// 	User.findAll({
// 		where: {
// 			[Op.or]: [

// 				{
// 					username: { [Op.iLike]: `%${req.body.username}%` },
// 					updated_at: {
// 						$gte: new Date(req.body.fromDate).toUTCString(),
// 						$lte: new Date(req.body.fromDate).toLocaleString()
// 					},
// 				}				
// 			],
// 		},
// 	})
// 		.then((result) => {
// 			var response = {
// 				status: "success",
// 				result: result,
// 			};
// 			res.send(response);
// 		})
// 		.catch((err) => {
// 			var response = {
// 				status: "error",
// 				message: err.message,
// 			};
// 			res.send(response);
// 		});
// };

exports.getFilter = async (req, res) => {

	console.log(req.body?.username);
	const username = req.body.username;
	const user_type = req.body.user_type;
	const fromDate = req.body.fromDate;
	const toDate = req.body.toDate;
	console.log(username);
	try {
		const [results, metadata] = await seqOp.query(
			`SELECT "id", "name", "email", "username", "password", "role", "user_type", "practiceId", 
			  "practice", "contact_person", "contact_number", "location", "ip_address", "email_notification", 
			  "sms_notification", "messenger_type", "messenger_number", "status", "is_activity", "totpSecret", "totpAuthUrl",
			  "created_by", "modified_by", "created_at" AS "createdAt", "updated_at" AS "updatedAt" 
			  FROM "users" AS "user" 
			  WHERE (:username is NULL or "user"."username"= :username) AND (:user_type IS NULL or "user"."user_type"= :user_type) AND
			  (:fromDate is NULL or DATE("user"."updated_at") >= :fromDate) AND (:toDate is NULL or DATE("user"."updated_at") <= :toDate) AND "user"."ip_address" IS NOT NULL;`,
			{ replacements: { username, user_type, fromDate, toDate } }
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

exports.filter = (req, res) => {
	User.findAll({
		where: {
			[Op.or]: [
				{
					user_type: { [Op.iLike]: `%${req.body.userType}%` },
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


exports.assign = async (req, res) => {
	var sql_maped_query = {};
	switch (req.body.role) {
		case "customer":
			sql_maped_query = {
				customer_by_id: req.body.id,
			};
			break;
		case "practice":
			sql_maped_query = {
				practice_by_id: req.body.id,
			};
			break;
		case "physician":
			sql_maped_query = {
				physician_by_id: req.body.id,
				practice_admin_id: req.body.practice_admin_id
			};
			break;
	}

	var sql_unmaped_query = {};
	switch (req.body.role) {
		case "customer":
			sql_unmaped_query = {
				customer_by_id: null,
			};
			break;
		case "practice":
			sql_unmaped_query = {
				practice_by_id: null,
			};
			break;
		case "physician":
			sql_unmaped_query = {
				physician_by_id: null,
				practice_admin_id: req.body.practice_admin_id
			};
			break;
	}

	var insertArray = new Array();
	req.body.maped.forEach((item) => {
		let query = JSON.parse(JSON.stringify(sql_maped_query));
		query.assigned_id = item;
		insertArray.push(query);
	});

	await AssistantAssign.bulkCreate(insertArray);
	await AssistantAssign.update(sql_unmaped_query, {
		where: {
			assigned_id: req.body.unmaped,
			practice_admin_id: req.body.practice_admin_id
		},
	});
	await AssistantAssign.destroy({
		where: {
			customer_by_id: null,
			practice_by_id: null,
			physician_by_id: null,
		},
	});

	var response = {
		status: "success",
	};
	res.send(response);
};

exports.practiceGetAssign = async (req, res) => {
	const { userType, assigned_id } = req.body;

	const assignedData = await CustomerAssign.findOne({
		where: {
			assigned_id: assigned_id
		}
	})

	const users = await User.findAll({
		where: {
			user_type: userType
		}
	})

	const userIds = users.map(data => {return data.id})

	const assignedPractices = await CustomerAssign.findAll({
		where: {
			type: "PRACTICE",
			assigned_id: {
				[Op.in]: userIds
			}
		}
	})

	const assignedIds = []
	if(assignedPractices && assignedPractices.length > 0){
		assignedPractices.map((elm)=>{
			if(elm.referenceIds.length > 0){
				elm.referenceIds.map((res)=>{
					assignedIds.push(res)
				})
			}
		})
		// assignedIds = assignedPractice.referenceIds
	}

	let unassignedPractice = [];
	switch (userType) {
		case "operations":
			unassignedPractice = await Practices.findAll({
				where: {
					id:{
						[Op.notIn] : assignedIds
					},
					status: true,
					interpretation_mode: {
						[Op.notIn] : ['self']
					}
				}
			})
			break;
		case "billing":
			unassignedPractice = await Practices.findAll({
				where: {
					id:{
						[Op.notIn] : assignedData ? assignedData.referenceIds : []
					},
					status: true
				}
			})
			break;
		case "support":
			unassignedPractice = await Practices.findAll({
				where: {
					id:{
						[Op.notIn] : assignedIds
					},
					status: true
				}
			})
			break;
		default:
			break;
	}

	const assignedDetails = await Practices.findAll({
		where: {
			id: {
				[Op.in]: assignedData ? assignedData.referenceIds : []
			},
			status: true
		}
	})

	var response = {
		status: "success",
		notAssigned: unassignedPractice,
		assigned: assignedDetails,
	};
	res.send(response);
}

exports.getAssign = async (req, res) => {
	const { practiceAdminId } = req.query;
	var sql_query = {};
	var assgined_ids = [];
	console.log("-------------------- Role ----------------------------");
	console.log(req.body.role);

	switch (req.body.role) {
		case "customer":
			sql_query = {
				customer_by_id: req.body.id,
				...(practiceAdminId
					? {
						practice_admin_id: practiceAdminId,
					}
					: {}),
			};
			break;
		case "practice":
			sql_query = {
				practice_by_id: req.body.id,
				...(practiceAdminId
					? {
						practice_admin_id: practiceAdminId,
					}
					: {}),
			};
			break;
		case "physician":
			sql_query = {
				physician_by_id: req.body.id,
				...(practiceAdminId
					? {
						practice_admin_id: practiceAdminId,
					}
					: {}),
			};
			break;
	}

	const result = await AssistantAssign.findAll({
		attributes: ["assigned_id"],
		where: sql_query,
	});
	result.map((item) => assgined_ids.push(item.dataValues.assigned_id));

	const findAssignedUser = await User.findAll({
		where: {
			id: assgined_ids,
			role: "assistant",
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		},
	});
	const findNotAssignedUser = await User.findAll({
		where: {
			role: "assistant",
			id: {
				[Op.notIn]: assgined_ids,
			},
			status: true,
			...(practiceAdminId
				? {
					practice_admin_id: practiceAdminId,
				}
				: {}),
		},
	});

	var response = {
		status: "success",
		notAssigned: findNotAssignedUser,
		assigned: findAssignedUser,
	};
	res.send(response);
};

exports.getPhysician = async (req, res) => {
	try {
		const assgined_ids = [];

		const result = await AssistantAssign.findAll({
			where: {
				assigned_id: req.query.assigned_id,
			},
		});
		result.map((item) =>
			assgined_ids.push(item.dataValues.physician_by_id)
		);

		const physicians = await User.findAll({
			where: {
				id: assgined_ids,
			},
		});
		const response = {
			status: "success",
			result,
			physicians,
		};
		res.send(response);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: error.message,
		});
	}
};
