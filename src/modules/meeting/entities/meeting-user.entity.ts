import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity({ comment: '모임 유저' })
export class MeetingUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true, comment: '가입(수락) 일시' })
  joinedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.meetingUsers, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Meeting, (meeting) => meeting.meetingUsers, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  meeting: Meeting;
}
