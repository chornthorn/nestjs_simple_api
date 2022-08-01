import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtAccessPayload } from '@app/common/types/jwt-access-payload.type';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtAccessPayload;
    return user.userId;
  },
);
