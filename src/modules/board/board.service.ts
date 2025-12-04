import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { BoardReply } from './entities/board-reply.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { CreateBoardReplyDto } from './dto/create-board-reply.dto';
import { TransactionService } from 'src/common/transaction/transaction.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardReply)
    private readonly boardReplyRepository: Repository<BoardReply>,
    private readonly transactionService: TransactionService
  ) {}

  // 모임 게시판 글 목록 조회
  async getBoardList(meetingId: number) {
    const findBoards = await this.boardRepository.find({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          nickname: true
        },
        boardReplies: {
          id: true,
          reply: true,
          createdAt: true,
          user: {
            nickname: true
          }
        }
      },
      where: {
        meeting: { id: meetingId }
      },
      relations: ['user', 'boardReplies'],
      order: { createdAt: 'DESC' }
    });

    return findBoards;
  }

  // 게시글, 댓글 본인 표시
  private markedMine(boards: Board, userId: number) {
    if (boards.user.id === userId) {
      (boards.user as any).isMine = 1;
    }

    boards.boardReplies.forEach((br) => {
      if (br.user.id === userId) {
        (br.user as any).isMine = 1;
      }
    });
  }

  // 모임 게시판 글 상세
  async getBoardDetail(id: number, user: User) {
    const userId = user.id;

    const findBoard = await this.boardRepository.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          id: true,
          nickname: true
        },
        boardReplies: {
          id: true,
          reply: true,
          createdAt: true,
          user: {
            id: true,
            nickname: true
          }
        }
      },
      where: {
        id
      },
      relations: ['user', 'boardReplies']
    });

    if (!findBoard) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    this.markedMine(findBoard, userId);

    return findBoard;
  }

  // 모임 게시판 글 작성
  async createBoard(createBoardDto: CreateBoardDto, user: User) {
    const userId = user.id;
    const { title, content, meetingId } = createBoardDto;

    const newBoard = this.boardRepository.create({
      title: title,
      content: content,
      user: { id: userId },
      meeting: { id: meetingId }
    });

    await this.boardRepository.save(newBoard);

    return true;
  }

  // 모임 게시판 글 삭제
  async deleteBoard(id: number, user: User) {
    const userId = user.id;
    await this.transactionService.runInTransaction(async (tr) => {
      const boardRepo = tr.getRepository(Board);
      const boardReplyRepo = tr.getRepository(BoardReply);

      await boardReplyRepo.softDelete({ board: { id }, user: { id: userId } });
      await boardRepo.softDelete({ id, user: { id: userId } });

      return true;
    });

    return true;
  }

  // 모임 게시판 댓글 작성
  async createBoardReply(createBoardReplyDto: CreateBoardReplyDto, user: User) {
    const userId = user.id;
    const { boardId, reply } = createBoardReplyDto;

    const board = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!board) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_DATA);
    }

    const newBoardReply = this.boardReplyRepository.create({
      reply,
      user: { id: userId },
      board: { id: boardId }
    });

    await this.boardReplyRepository.save(newBoardReply);

    return true;
  }

  // 모임 게시판 댓글 삭제
  async deleteBoardReply(id: number, user: User) {
    const userId = user.id;
    await this.boardReplyRepository.softDelete({ id, user: { id: userId } });

    return true;
  }
}
