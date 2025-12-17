import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomRepository } from './chat-room.repository';

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
