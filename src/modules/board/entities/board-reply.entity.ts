import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity({ comment: '모임 게시판 댓글' })
export class BoardReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '댓글' })
  reply: string;

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

  @ManyToOne(() => Board, (board) => board.boardReplies, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  board: Board;
}
