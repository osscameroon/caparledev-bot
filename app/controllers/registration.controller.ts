import { Request, Response, NextFunction } from 'express';

import { RegistrationModel } from '../models/registration.model';
import { IRegistration } from '../types/models';

/**
 * Registration controller class
 */
class RegistrationController {
	/**
	 * getOneRegistration()
	 *
	 * Get one registration
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async getOneRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;

		if (!id) {
			res.status(422).json({ error: 'The registration id is missing!' });
		}

		const registration: IRegistration|null = await RegistrationModel.findOne({ _id: id });

		res.json(registration);
	}

	/**
	 * deleteRegistration()
	 *
	 * Delete a registration
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async deleteRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;

		if (!id) {
			res.status(422).json({ error: 'The Registration id is missing!' });
		}

		await RegistrationModel.findByIdAndDelete({ _id: id });

		res.json({ message: 'success' });
	}

	/**
	 * getRegistrations()
	 *
	 * Get the list of all registrations
	 *
	 * @param {Request} req: Request object
	 * @param {Response} res: Response object
	 * @param {NextFunction} next: NextFunction object
	 *
	 * @return Object
	 */
	public static async getRegistrations(req: Request, res: Response, next: NextFunction): Promise<void> {
		const response: IRegistration[] = await RegistrationModel.find({}).sort({ createdAt: -1 }).exec();

		res.json(response);
	}
}

export { RegistrationController };
