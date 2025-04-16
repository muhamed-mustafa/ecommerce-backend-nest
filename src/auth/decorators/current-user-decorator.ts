import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadType } from 'src/utils/jwt.type';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as JWTPayloadType;
  },
);
