import { CourseActivity } from '@/course-activity/entities/course-activity.entity';
import { Course } from '@/course/entities/course.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserCourseActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.id)
  @JoinColumn({ name: 'course_id' })
  @Column()
  course_id: number;

  @ManyToOne(() => CourseActivity, (courseActivity) => courseActivity.id)
  @JoinColumn({ name: 'course_activity_id' })
  @Column()
  course_activity_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column()
  user_id: number;

  @Column({ nullable: true })
  file_path: string;

  @Column({ nullable: true, type: 'text' })
  file_upload: string;

  @Column()
  @CreateDateColumn()
  create_datetime: Date;

  @Column()
  @UpdateDateColumn()
  update_datetime: Date;

  @Column({ nullable: true })
  @DeleteDateColumn()
  delete_datetime: Date;
}
