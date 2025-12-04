import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { BoardService } from '../board.service';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateBoardDto } from '../dto/create-board.dto';
import { CreateBoardReplyDto } from '../dto/create-board-reply.dto';

@Controller('user/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 모임 게시판 글 목록 조회
  @Get('list/:meetingId')
  async getBoardList(@Param('meetingId', ParseIntPipe) meetingId: number) {
    return await this.boardService.getBoardList(meetingId);
  }

  // 모임 게시판 글 상세
  @Get(':id')
  async getBoardDetail(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.boardService.getBoardDetail(id, user);
  }

  // 모임 게시판 글 작성
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto, @AuthUser() user: User) {
    return await this.boardService.createBoard(createBoardDto, user);
  }

  // 모임 게시판 글 삭제
  @Delete(':id')
  async deleteBoard(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.boardService.deleteBoard(id, user);
  }

  // 모임 게시판 댓글 작성
  @Post('reply')
  async createBoardReply(@Body() createBoardReplyDto: CreateBoardReplyDto, @AuthUser() user: User) {
    return await this.boardService.createBoardReply(createBoardReplyDto, user);
  }

  // 모임 게시판 댓글 삭제
  @Delete('reply/:id')
  async deleteBoardReply(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return await this.boardService.deleteBoardReply(id, user);
  } 
}
