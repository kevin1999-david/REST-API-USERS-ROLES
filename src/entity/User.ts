import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { IsNotEmpty, MinLength, IsEmail } from "class-validator";

import { genSaltSync, hashSync, compareSync } from "bcryptjs";


@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsEmail()
    username: string;

    @Column()
    @MinLength(8)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;


    hashPassword(): void {
        const salt = genSaltSync(10);
        this.password = hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return compareSync(password, this.password);
    }

}
