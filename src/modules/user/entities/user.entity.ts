import {  Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ comment: '유저' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

}
