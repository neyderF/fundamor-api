/* eslint-disable camelcase */
const { Op } = require("sequelize");
const foundation = require("../models").foundation;
const animal = require("../models").animal;
const question = require("../models").question;
const post = require("../models").post;
const adoptionQuestion = require("../models").adoptionQuestion;
const adopter = require("../models").adopter;
const adoption = require("../models").adoption;

exports.create = async (req, res) => {


	try {

		let condition = [{ nombre: req.body.nombre }];

		if (req.body.correo) {
			condition.push({ correo: req.body.correo });
		}
		const searchResult = await foundation.findAll({
			where: {
				[Op.or]: condition
			}
		});

		if (searchResult.length === 0) {
			const result = await foundation.create(req.body);
			res.status(201).json({
				state: true,
				message: "La fundación se ha creado con éxito",
				data: result.id_fundacion // id assigned
			});
		} else {
			res.status(200).json({
				state: false,
				message: "Ya existe una fundación registrada con este nombre o correo"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al crear la fundación"
		});
	}
};

exports.delete = async (req, res) => {
	try {

		const result = await foundation.destroy({
			where: {
				id_fundacion: req.params["id"]
			}
		});

		if (result === 1) {
			res.status(200).json({
				state: true,
				message: "La fundación se ha eliminado exitosamente"
			});
		} else {
			res.status(200).json({
				state: false,
				message: "La fundación no existe"
			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la fundación"
		});
	}
};


exports.myFoundation = async (req, res) => {

	try {
		const searchResult = await foundation.findByPk(2);

		if (searchResult) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "La fundación no existe"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la fundación"
		});
	}

};

exports.get = async (req, res) => {

	try {
		const searchResult = await foundation.findByPk(req.params["id"]);

		if (searchResult) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "La fundación no existe"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la fundación"
		});
	}

};

exports.update = async (req, res) => {
	try {

		await foundation.update(req.body, {
			where: {
				id_fundacion: req.userSession.id_fundacion
			}
		});

		res.status(200).json({
			state: true,
			message: "Los datos de la fundación se han actualizado exitosamente"

		});

	} catch (error) {

		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al actualizar los datos de la fundación"
		});

	}
};
exports.list = async (req, res) => {


	try {
		const searchResult = await foundation.findAll({});

		if (searchResult.length !== 0) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "No existen registros en la base de datos"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la lista de fundaciones"
		});
	}

};

exports.animalsPagination = async (req, res) => {


	try {
		let searchResult = null;

		if (req.query.min !== undefined && req.query.max !== undefined && req.query.order !== undefined &&
			req.query.search !== undefined && req.query.specie !== undefined && req.query.size !== undefined) {


			searchResult = await animal.findAndCountAll({
				where: {
					id_fundacion: 2,
					estado: "Sin adoptar",
					nombre: {
						[Op.like]: `%${req.query.search}%`
					},
					especie: {
						[Op.like]: `%${req.query.specie}%`
					},
					tamanio: {
						[Op.like]: `%${req.query.size}%`
					}
				},
				include: "animalImage",
				distinct: true,
				order: [["id_animal", req.query.order === "recent" ? "DESC" : "ASC"]],
				limit: req.query.max ? parseInt(req.query.max) : 0,
				offset: req.query.min ? parseInt(req.query.min) : 0
			});
		} else {
			searchResult = await animal.findAndCountAll({
				where: {
					id_fundacion: req.params.id,
					estado: "Sin adoptar"
				},
				include: "animalImage"
			});
		}
		if (searchResult && searchResult.length !== 0) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "No existen registros en la base de datos"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la lista de animales"
		});
	}


};



exports.postPagination = async (req, res) => {


	try {
		let searchResult = null;

		if (req.query.min !== undefined && req.query.max !== undefined && req.query.search !== undefined) {


			searchResult = await post.findAndCountAll({
				where: {
					id_fundacion: 2,
					titulo: {
						[Op.like]: `%${req.query.search}%`
					}

				},
				include: "postImage",
				distinct: true,
				order: [["id_publicacion", "DESC"]],
				limit: req.query.max ? parseInt(req.query.max) : 0,
				offset: req.query.min ? parseInt(req.query.min) : 0
			});
		} else {
			searchResult = await post.findAndCountAll({
				where: {
					id_fundacion: 2

				},
				include: "postImage"
			});
		}
		if (searchResult && searchResult.length !== 0) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "No existen registros en la base de datos"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener la lista de publicaciones"
		});
	}


};
exports.getAnimal = async (req, res) => {
	try {
		const searchResult = await animal.findByPk(req.params["id_animal"], { include: "animalImage" });

		if (searchResult && searchResult.estado === "Sin adoptar") {


			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: searchResult
			});
		} else {
			res.status(200).json({
				state: false,
				message: "En este momento este animal no se encuentra disponible para ser adoptado"

			});
		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al obtener el animal"
		});
	}
};


exports.adopterForm = async (req, res) => {

	try {
		const animalDetail = await animal.findByPk(req.params["id_animal"], {
			include: "animalImage"
		});


		if (animalDetail && animalDetail.estado === "Sin adoptar") {
			const questions = await question.findAll({
				where: {
					id_fundacion: req.params.id
				},
				order: [
					["id_pregunta", "ASC"],
					["questionOptions", "id_opcion", "ASC"]
				],
				include: "questionOptions"

			});


			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: {
					animal: animalDetail,
					questions: questions
				}
			});
		} else {

			res.status(200).json({
				state: false,
				message: "En este momento este animal no se encuentra disponible para ser adoptado"

			});

		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error"
		});

	}
};


exports.getPost = async (req, res) => {

	try {
		const searchResult = await post.findByPk(req.params["id_post"], {

			include: "postImage"
		});
		const recentPost = await post.findAll({
			where: {
				id_fundacion: req.params.id

			},
			include: "postImage",
			order: [["id_publicacion", "DESC"]],
			limit: 5
		});

		if (searchResult) {

			res.status(200).json({
				state: true,
				message: "Resultados obtenidos",
				data: {
					post: searchResult,
					recentPost: recentPost
				}
			});

		} else {

			res.status(200).json({
				state: false,
				message: "En este momento la publicación no se encuentra disponible"

			});

		}

	} catch (error) {
		// console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error"
		});

	}

};
exports.sendContactMessage = (req, res) => {

	res.status(200).json({
		state: true,
		message: "El mensaje ha sido enviado con éxito, nos pondremos en contacto contigo lo antes posible"
	});
};


exports.receiveAdopterForm = async (req, res) => {


	try {
		const {
			idAnimal = null,
			nombre = null,
			identificacion = null,
			email = null,
			ocupacion = null,
			ciudad = null,
			fijo = null,
			movil = null,
			preguntas = null
		} = req.body;


		let id_adopter = "";


		const searchResult = await adopter.findByPk(identificacion);
		if (searchResult) {
			id_adopter = searchResult.id_adoptante;

		} else {
			//crea el adoptante
			const result = await adopter.create({
				id_adoptante: identificacion,
				nombre: nombre,
				telefono_casa: fijo === "" ? null : fijo,
				telefono_celular: movil === "" ? null : movil,
				ciudad: ciudad === "" ? null : ciudad,
				ocupacion: ocupacion === "" ? null : ocupacion,
				correo: email === "" ? null : email

			});
			id_adopter = result.id_adoptante;
		}


		let adoptionData = {
			id_adoptante: id_adopter,
			fecha_estudio: Date.now(),
			id_animal: idAnimal,
			estado: "en espera"
		};

		//crea la adopcion
		const result = await adoption.create(adoptionData);

		if (result) {

			if (preguntas.length !== 0) {

				let questionsFormattedData = [];

				preguntas.forEach(element => {
				
					questionsFormattedData.push({
						id_adopcion: result.id_adopcion,
						id_pregunta: element.questionId,
						respuesta: element.answer
					});

				});

				const resultQuestionAnswers = await adoptionQuestion.bulkCreate(questionsFormattedData);

				await animal.update({ estado: "En proceso" }, {
					where: {
						id_animal: idAnimal
					}
				});


				if (resultQuestionAnswers) {
					res.status(201).json({
						state: true,
						message: "Su solicitud ha sido enviada, pronto nos contactaremos con usted para darle una respuesta",
						data: result.id_adopcion // id assigned
					});
				} else {
					res.status(201).json({
						state: false,
						message: "Ha ocurrido un error al registrar las respuestas del formulario"
					});
				}
			} else {

				res.status(201).json({
					state: true,
					message: "Su solicitud ha sido enviada, pronto nos contactaremos con usted para darle una respuesta",
					data: result.id_adopcion // id assigned
				});
			}
		} else {
			res.status(201).json({
				state: false,
				message: "No se ha podido realizar la solicitud, por favor intente mas tarde"
			});
		}

	} catch (error) {
		console.error(error);
		res.status(400).json({
			state: false,
			message: "Ha ocurrido un error al registrar la la solicitud de adopción"
		});
	}
};
