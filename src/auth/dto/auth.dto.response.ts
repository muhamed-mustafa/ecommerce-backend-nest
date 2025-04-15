import { User } from 'src/user/user.entity';

export class AuthResponseDto {
  user: User;
  token: string;
}
