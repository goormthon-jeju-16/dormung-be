import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserPreferredCategory } from 'src/modules/meeting/entities/user-preferred-category.entity';
import { MeetingUser } from 'src/modules/meeting/entities/meeting-user.entity';
import { Board } from 'src/modules/board/entities/board.entity';
import { BoardReply } from 'src/modules/board/entities/board-reply.entity';

@Entity({ comment: '유저' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '거주지역' })
  residenceArea: string;

  @Column({ type: 'varchar', comment: '닉네임' })
  nickname: string;

  @Column({ type: 'varchar', comment: '체류기간' })
  residencePeriod: string;

  @Column({ type: 'varchar', comment: '자기소개' })
  introduceSelf: string;

  @Column({ type: 'varchar', comment: '프로필 이미지 경로', nullable: true })
  profileImagePath: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => UserPreferredCategory, (userPreferredCategory) => userPreferredCategory.user)
  userPreferredCategories: UserPreferredCategory[];

  @OneToMany(() => MeetingUser, (meetingUser) => meetingUser.user)
  meetingUsers: MeetingUser[];

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @OneToMany(() => BoardReply, (boardReply) => boardReply.user)
  boardReplies: BoardReply[];
}
