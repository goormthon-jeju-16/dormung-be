import { Exclude } from 'class-transformer';
import { Meeting } from 'src/modules/meeting/entities/meeting.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BoardReply } from './board-reply.entity';

@Entity({ comment: '모임 게시판' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.boards, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Meeting, (meeting) => meeting.boards, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  meeting: Meeting;

  @OneToMany(() => BoardReply, (boardReply) => boardReply.board)
  boardReplies: BoardReply[];
}
