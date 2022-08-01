import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshPayload } from '@app/common/types/jwt-refresh-payload.type';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtRefreshPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
