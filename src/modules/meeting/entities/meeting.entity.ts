import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MeetingCategoryName } from '../constants/meeting-category-name.enum';
import { MeetingUser } from './meeting-user.entity';

@Entity({ comment: '모임' })
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '모임명' })
  name: string;

  @Column({ type: 'varchar', comment: '지역' })
  area: string;

  @Column({ type: 'tinyint', default: 0, comment: '활성화 여부' })
  isActive: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => MeetingUser, (meetingUser) => meetingUser.meeting)
  meetingUsers: MeetingUser[];
}
