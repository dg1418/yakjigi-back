import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatMessageRepository } from './chat-message.repository';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatMessageService {
  private readonly logger = new Logger(ChatMessageService.name);
  private readonly ollamaUrl = 'http://ollama:11434/api/generate';

  constructor(
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly httpService: HttpService,
  ) {}

  async create(createChatMessageDto: CreateChatMessageDto, userId: number) {
    // 1. 사용자 메시지 DB에 저장
    await this.chatMessageRepository.create({
      userId,
      chatRoomId: createChatMessageDto.chatRoomId,
      content: createChatMessageDto.content,
      sender: 'user',
    });

    let botContent: string;

    try {
      this.logger.log(
        `Requesting response from Ollama for prompt: "${createChatMessageDto.content}"`,
      );

      // 2. Ollama API에 요청하고 응답을 기다림
      const ollamaResponse = await firstValueFrom(
        this.httpService.post(this.ollamaUrl, {
          model: 'yakjigi-bot',
          prompt: createChatMessageDto.content,
          stream: false,
        }),
      );

      botContent = ollamaResponse.data.response;
      this.logger.log(`Received response from Ollama: "${botContent}"`);

      // 3. 봇의 응답을 DB에 저장
      await this.chatMessageRepository.create({
        chatRoomId: createChatMessageDto.chatRoomId,
        content: botContent,
        sender: 'bot',
      });
    } catch (error) {
      this.logger.error('Failed to get response from Ollama or save bot message', error);
      botContent = '죄송합니다, 답변을 생성하는 데 문제가 발생했습니다.';
      // 에러 발생 시, 봇이 에러 메시지를 보내는 것처럼 처리
      await this.chatMessageRepository.create({
        chatRoomId: createChatMessageDto.chatRoomId,
        content: botContent,
        sender: 'bot',
      });
    }

    // 4. 봇의 응답 내용을 프론트엔드로 반환
    return { response: botContent };
  }

  async findAll(chatRoomId: number) {
    return this.chatMessageRepository.findAllByChatRoomId(chatRoomId);
  }
}