import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserSessionPayload } from 'src/auth/session/dto/user-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IsRelatedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const parent = request.session.parent as UserSessionPayload;

    const childId = request.params.id;
    const exist = await this.prisma.userChild.findFirst({
      where: {
        id: childId,
        userParentId: parent.userId,
      },
    });

    if (!exist) return false;

    return true;
  }
}
