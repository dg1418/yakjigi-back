import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatMessageModule } from './chat-message/chat-message.module';

@Module({
  imports: [AuthModule, UserModule, ChatRoomModule, ChatMessageModule],
})
export class AppModule {}
