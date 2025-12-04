import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MeetingCategory } from './meeting-category.entity';

@Entity({ comment: '유저 관심 카테고리' })
export class UserPreferredCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => MeetingCategory, (meetingCategory) => meetingCategory.userPreferredCategories, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  meetingCategory: MeetingCategory;

  @ManyToOne(() => User, (user) => user.userPreferredCategories, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;
}
