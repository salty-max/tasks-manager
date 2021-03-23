import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserRO } from './auth-credentials.dto';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserRO => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
