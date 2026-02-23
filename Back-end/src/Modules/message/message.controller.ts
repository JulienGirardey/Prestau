import { Controller, Get, Post, Body, Param, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUserRequest } from "../auth/interfaces/jwt-payload.interface";

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Req() req: CurrentUserRequest) {
    return this.messageService.create(createMessageDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: CurrentUserRequest) {
    return this.messageService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: CurrentUserRequest) {
    return this.messageService.findOne(id, req.user.id);
  }

}
