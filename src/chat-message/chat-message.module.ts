import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageRepository } from './chat-message.repository';

@Module({
  imports: [HttpModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageRepository],
})
export class ChatMessageModule {}
