import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StorageFactory } from 'src/storage/storage.factory';
import {
  StorageProvider,
  StorageProviderClient,
} from 'src/storage/storage.provider';
import { EventCreateInput } from './events.dto';

@Injectable()
export class EventsService {
  private storageProvider: StorageProvider<StorageProviderClient>;
  constructor(
    private prisma: PrismaService,
    private storageFactory: StorageFactory,
  ) {
    this.storageProvider = this.storageFactory.getStorageService();
  }

  async findById(id: string) {
    const select = {
      id: true,
      name: true,
      description: true,
      cover: true,
      start_date: true,
      end_date: true,
      users: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true,
          email: true,
        },
      },
      medias: true,
    };
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      select,
    });
  }

  findNameById(id: string) {
    const select = {
      id: true,
      name: true,
    };
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      select,
    });
  }

  create(eventInput: EventCreateInput) {
    const { name, description, cover, start_date, end_date, users_ids } =
      eventInput;
    const event = {
      name,
      description,
      cover,
      start_date,
      end_date,
    };
    return this.prisma.event.create({
      data: {
        name,
        description,
        cover,
        start_date,
        end_date,
        users: {
          connect: users_ids.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
      },
    });
  }

  findEventMedias(id: string) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        medias: {
          select: {
            // url: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
  }

  updateUsersConnectionsToEvent(
    eventId: string,
    usersIds: string[],
    isConnection: boolean,
  ) {
    const dataUsersField = {
      [isConnection ? 'connect' : 'disconnect']: usersIds.map((id) => ({ id })),
    };
    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        users: dataUsersField,
      },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  // handleEventCoverUrl(event: { cover: string }): Promise<string> {
  //   if (event.cover.startsWith('assets')) {
  //     return Promise.resolve(event.cover);
  //   }
  //   return this.storageProvider.getSignedUrl(event.cover);
  // }
}
