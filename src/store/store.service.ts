import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/guards/jwt.strategy';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './entities/store.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFileDto } from './dto/update-file.dto';
import * as fs from 'fs';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}
  async createFile(
    file: Express.Multer.File,
    dto: CreateFileDto,
    user: JwtUser,
    originalName?: string,
  ) {
    const userData = await this.userModel.findOne({ id: user.userId });
    const newStore = new this.storeModel({
      id: uuidv4(),
      title: dto.title ? dto.title : originalName,
      branch: dto.branch,
      file: file.filename,
      author: userData.name,
      author_id: user.userId,
    });

    return await newStore.save();
  }

  async updateFile(
    id: string,
    file: Express.Multer.File,
    dto: UpdateFileDto,
    originalName?: string,
  ) {
    const fileData = await this.storeModel.findOne({ id });
    let title;
    if (dto.title) {
      title = dto.title;
    } else if (originalName) {
      title = originalName;
    } else {
      title = fileData.title;
    }
    return await this.storeModel.findOneAndUpdate(
      { id },
      {
        title,
        branch: dto.branch ? dto.branch : fileData.branch,
        file: file?.filename ? file?.filename : fileData.file,
      },
      {
        new: true,
      },
    );
  }

  async getAllFiles() {
    return this.storeModel.find({});
  }

  async deleteFile(id: string) {
    // get file
    const file = await this.storeModel.findOne({ id });
    // delete file
    fs.unlink(`./upload/${file.file}`, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });
    // delete file from db
    await this.storeModel.deleteOne({ id });
  }
}
