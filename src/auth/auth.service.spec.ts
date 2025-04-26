import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  const REPOSITORY_TOKEN = getRepositoryToken(User);
  let configService: ConfigService;
  let userService: UserService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn((user: User) => Promise.resolve({ ...user, id: 1 })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            assertEmailIsAvailable: jest.fn(),
            createUser: jest.fn((user: User) =>
              Promise.resolve({ ...user, id: 1 }),
            ),
            save: jest.fn((user: User) => Promise.resolve({ ...user, id: 1 })),
            generateJwtToken: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            get: jest.fn(),
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(REPOSITORY_TOKEN);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should user repository be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('register user', () => {
    it('should call findOne method', async () => {
      const data = await service.signup({
        username: 'test',
        email: 'test',
        password: 'test',
      });

      console.log('`data`', data);

      expect(userService.assertEmailIsAvailable).toHaveBeenCalled();
      expect(userService.assertEmailIsAvailable).toHaveBeenCalledTimes(1);
    });
  });
});
