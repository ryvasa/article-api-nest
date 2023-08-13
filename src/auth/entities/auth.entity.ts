import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  @ApiProperty()
  googleId?: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty()
  facebaookId?: string;

  @OneToOne(() => User, (user) => user.auth)
  user: User;
}
