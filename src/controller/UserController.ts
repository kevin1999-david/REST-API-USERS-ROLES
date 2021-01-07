import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

import { validate } from "class-validator"
import { userInfo } from "os";


export class UserController {

    static getAllUsers = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users: any
        try {
            users = await userRepository.find();
        } catch (error) {
            res.status(404).json({
                message: 'Somethin goes wrong'
            })
        }


        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(404).json(
                { message: 'There are no users yet' }
            );
        }
    }

    static getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch (error) {
            res.status(404).json(
                { message: 'There is no user' }
            );
        }
    }

    static newUser = async (req: Request, res: Response) => {
        const { username, password, role } = req.body;
        const user = new User();

        user.username = username;
        user.password = password;
        user.role = role;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } }
        const errors = await validate(user, validationOpt);

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        //TODO: HASH PASSWORD

        const userRepository = getRepository(User);

        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({
                message: 'Username already exist in the database'
            });
        }
        res.send('User created');
    }

    static editUser = async (req: Request, res: Response) => {
        let user: any;
        const { id } = req.params;
        const { username, role } = req.body;

        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;
        } catch (error) {
            return res.status(404).json(
                { message: 'User not found!' }
            );
        }

        const validationOpt = { validationError: { target: false, value: false } }
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json(
                {
                    message: 'Username already in use',
                    error
                }
            );
        }
        res.status(201).json({ message: 'User updated' });
    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json(
                { message: 'User not found!' }
            );
        }

        userRepository.delete(id);
        res.status(201).json(
            { message: 'User deleted successfully' }
        );
    }
    // private userRepository = getRepository(User);

    // async all(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.find();
    // }

    // async one(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.findOne(request.params.id);
    // }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.save(request.body);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.userRepository.findOne(request.params.id);
    //     await this.userRepository.remove(userToRemove);
    // }

}

export default UserController;