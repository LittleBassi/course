import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  section: string;

  @Column()
  duration: string;

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
