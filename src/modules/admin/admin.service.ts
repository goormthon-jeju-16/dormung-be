import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>
  ) {}

  async getAdminByLoginId(loginId: string) {
    const findAdmin = await this.adminRepo.findOne({
      select: ['id', 'password'],
      where: { loginId }
    });

    if (!findAdmin) {
      throw new UnauthorizedException(ErrorMessages.NOT_FOUND_USER);
    }

    return findAdmin;
  }
}
