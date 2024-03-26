import { Course } from '@/course/entities/course.entity';
import { compareHash, hash } from '@/utils/utils.constants';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

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

  @BeforeInsert()
  async hash(): Promise<void> {
    this.password = await hash(this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await compareHash(password, this.password);
  }

  // Additional props
  course?: Course[];
  url?: string;
}
