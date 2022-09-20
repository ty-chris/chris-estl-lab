import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import csv from 'csvtojson';
import { UserEntity } from 'src/entities/UserEntity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('csv'))
  async uploadFile(@UploadedFile() file): Promise<boolean> {
    try {
      const csvString = file.buffer.toString();
      const jsonArray = await csv().fromString(csvString);

      const success = await this.userService.processJsonArray(jsonArray);
      return success;
    } catch (e) {
      console.log('error: ', e);
      throw e;
    }
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userService.createNewUser(createUserDto);
    return user;
  }

  @Get('all')
  findAll() {
    return this.userService.all();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: UpdateUserDto) {
    return this.userService.updateUser(id, update);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ employeeId: id });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.remove({ employeeId: id });
  }

  @Get()
  findAllWithQuery(
    @Query('minSalary') minSalary: number,
    @Query('maxSalary') maxSalary: number,
    @Query('offset') offset: number,
    @Query('limit') limit = 30,
    @Query('sort') sort: string,
  ) {
    console.log('check inside');
    return this.userService.getUsersWithQueries(
      minSalary,
      maxSalary,
      offset,
      limit,
      sort,
    );
  }
}
