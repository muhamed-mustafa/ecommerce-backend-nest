import { User } from '../../user/user.entity';

export class AuthResponseDto {
  user: User;
  token: string;
}
