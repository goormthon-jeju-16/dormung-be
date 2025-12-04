import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPreferredCategory } from '../meeting/entities/user-preferred-category.entity';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPreferredCategory)
    private readonly userPreferredCategoryRepository: Repository<UserPreferredCategory>,
    private readonly transactionService: TransactionService,
    private readonly authService: AuthService
  ) {}

  // 거주기간 목록 조회
  async getResidencePeriodList() {
    const residencePeriods = ['1개월 미만', '1~3개월', '3~6개월', '6~12개월', '1년 이상'];
    return residencePeriods;
  }

  // 유저 생성
  async createUser(createUserDto: CreateUserDto) {
    const { residenceArea, nickname, residencePeriod, introduceSelf, profileImagePath, userPreferredCategoryIds } = createUserDto;
    const user = await this.transactionService.runInTransaction(async (tr) => {
      const userRepo = tr.getRepository(User);
      const userPreferredCategoryRepo = tr.getRepository(UserPreferredCategory);

      const newUser = userRepo.create({
        residenceArea,
        nickname,
        residencePeriod,
        introduceSelf,
        profileImagePath
      });
      const savedUser = await userRepo.save(newUser);

      if (userPreferredCategoryIds && userPreferredCategoryIds.length > 0) {
        const userPreferredCategories = userPreferredCategoryIds.map((categoryId) =>
          userPreferredCategoryRepo.create({
            user: savedUser,
            meetingCategory: { id: categoryId }
          })
        );
        await userPreferredCategoryRepo.save(userPreferredCategories);
      }

      return savedUser;
    });

    const { accessToken } = await this.authService.generateToken(user.id);
    return accessToken;
  }
}
