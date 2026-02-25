import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  openid: string;

  @Column({ length: 100, nullable: true })
  unionid: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'tinyint', nullable: true })
  sex: number;

  @Column({ length: 50, nullable: true })
  province: string;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ type: 'timestamp', nullable: true })
  first_auth_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_auth_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
