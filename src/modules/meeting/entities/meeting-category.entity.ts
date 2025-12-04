import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MeetingCategoryName } from '../constants/meeting-category-name.enum';
import { UserPreferredCategory } from './user-preferred-category.entity';

@Entity({ comment: '모임 카테고리' })
export class MeetingCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '카테고리 키' })
  key: MeetingCategoryName;
  
  @Column({ type: 'varchar', comment: '카테고리 이름' })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => UserPreferredCategory, (userPreferredCategory) => userPreferredCategory.meetingCategory)
  userPreferredCategories: UserPreferredCategory[];
}
