import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        avatar: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        avatar: true,
        email: true,
        password: true,
        target_event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findMany() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        avatar: true,
      },
    });
  }

  create(user: UserCreateDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  findUserEvents(id: string, short: boolean) {
    const eventSelect: boolean | Prisma.User$eventsArgs = short
      ? { select: { id: true, name: true } }
      : true;
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        events: eventSelect,
      },
    });
  }

  connectUserToEvent(userId: string, eventId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        target_event: {
          connect: {
            id: eventId,
          },
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        avatar: true,
        target_event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
