import { Controller, Get, Post, Body, Param, Req, ParseIntPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Req() req: CurentUserRequest) {
    return this.messageService.create(createMessageDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: CurentUserRequest) {
    return this.messageService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: CurentUserRequest) {
    return this.messageService.findOne(id, req.user.id);
  }

}
