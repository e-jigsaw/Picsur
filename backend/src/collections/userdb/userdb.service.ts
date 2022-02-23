import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail, HasFailed, HasSuccess } from 'src/types/failable';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  public async create(
    username: string,
    hashedPassword: string,
  ): AsyncFailable<UserEntity> {
    if (await this.exists(username)) return Fail('User already exists');

    const user = new UserEntity();
    user.username = username;
    user.password = hashedPassword;

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      return Fail(e.message);
    }

    return user;
  }

  public async delete(user: string | UserEntity): AsyncFailable<UserEntity> {
    const userToModify = await this.resolve(user);

    if (HasFailed(userToModify)) return userToModify;

    try {
      await this.usersRepository.remove(userToModify);
    } catch (e) {
      return Fail(e.message);
    }

    return userToModify;
  }

  public async findOne(username: string): AsyncFailable<UserEntity> {
    try {
      const found = await this.usersRepository.findOne({ where: { username } });
      if (!found) return Fail('User not found');
      return found;
    } catch (e) {
      return Fail(e.message);
    }
  }

  public async findAll(): AsyncFailable<UserEntity[]> {
    try {
      return await this.usersRepository.find();
    } catch (e) {
      return Fail(e.message);
    }
  }

  public async exists(username: string): Promise<boolean> {
    return HasSuccess(await this.findOne(username));
  }

  public async modifyAdmin(
    user: string | UserEntity,
    admin: boolean,
  ): AsyncFailable<true> {
    const userToModify = await this.resolve(user);

    if (HasFailed(userToModify)) return userToModify;

    userToModify.isAdmin = admin;
    await this.usersRepository.save(userToModify);

    return true;
  }

  private async resolve(
    user: string | UserEntity,
  ): AsyncFailable<UserEntity> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      return user;
    }
  }
}
