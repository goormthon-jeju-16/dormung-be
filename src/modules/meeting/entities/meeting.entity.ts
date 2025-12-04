import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MeetingCategoryName } from '../constants/meeting-category-name.enum';
import { MeetingUser } from './meeting-user.entity';
import { Board } from 'src/modules/board/entities/board.entity';
import { BoardReply } from 'src/modules/board/entities/board-reply.entity';

@Entity({ comment: '모임' })
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '모임 카테고리 이름' })
  categoryName: string;

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

  @OneToMany(() => Board, (board) => board.meeting)
  boards: Board[];
}
