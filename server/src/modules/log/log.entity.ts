import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('auth_logs')
@Index(['project_id'])
@Index(['openid'])
@Index(['created_at'])
export class AuthLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @Column({ length: 100 })
  openid: string;

  @Column({ length: 20 })
  scope: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;
}
