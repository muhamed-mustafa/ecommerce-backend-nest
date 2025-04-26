import { UpdateUserDto } from './dto/update.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType } from '../utils/jwt.type';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async assertEmailIsAvailable(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('User is already registered!');
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found!');
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found!');
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async updateUser(
    id: number,
    { username, password }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneById(id);
    user.username = username ?? user.username;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
  }

  async setIsVerified(id: number): Promise<User> {
    const user = await this.findOneById(id);
    user.isVerified = true;
    user.verificationToken = null;
    return await this.userRepository.save(user);
  }

  async checkPassword(user: User, password: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials!');
    return isMatch;
  }

  async generateJwtToken(user: User): Promise<string> {
    const payload: JWTPayloadType = { id: user.id, userType: user.userType };
    return this.jwtService.signAsync(payload);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
