import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const checkRole = (roles: Array<String>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = res.locals.jwtPayload;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (e) {
            return res.status(401).json({ message: 'There are no messages' })
        }

        const { role } = user;
        if (roles.includes(role)) {
            next();
        } else {
            res.status(401).json({ message: 'Not Authorized' })
        }
    }
}