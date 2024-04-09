import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MediaCreateDto } from './media.dto';

@Injectable()
export class MediasService {
  constructor(private prisma: PrismaService) {}

  // findById(id: string) {
  //   return this.prisma.media.findUnique({
  //     where: {
  //       id,
  //     },
  //     select: {
  //       url: true,
  //       user: true,
  //     },
  //   });
  // }

  create(media: MediaCreateDto) {
    return this.prisma.media.create({
      data: {
        etag: media.etag,
        filename: media.filename,
        is_cover: media.is_cover,
        event: {
          connect: {
            id: media.event_id,
          },
        },
        user: {
          connect: {
            id: media.creator_id,
          },
        },
      },
    });
  }
}
