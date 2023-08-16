import { ApiProperty } from '@nestjs/swagger';
import { Auth } from 'src/auth/entities/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column('text', { nullable: true })
  @ApiProperty()
  password?: string;

  @Column('text', { nullable: true })
  @ApiProperty()
  photo: string;

  @OneToOne(() => Auth, (auth) => auth.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth: Auth;
}
