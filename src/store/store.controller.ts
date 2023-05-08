import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtUser } from 'src/guards/jwt.strategy';
import { UpdateFileDto } from './dto/update-file.dto';

@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFileDto,
    @GetUser() user: JwtUser,
  ) {
    return await this.storeService.createFile(
      file,
      dto,
      user,
      file.originalname,
    );
  }

  @ApiBearerAuth()
  @Get(':file')
  getFile(@Param('file') file: string, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'upload/' + file)));
  }

  @ApiBearerAuth()
  @Get('/files/all')
  getAllFiles() {
    return this.storeService.getAllFiles();
  }

  @ApiBearerAuth()
  @Delete(':id')
  deleteFiles(@Param('id') id: string) {
    return this.storeService.deleteFile(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateFileDto,
    @Param('id') id: string,
  ) {
    return await this.storeService.updateFile(
      id,
      file,
      dto,
      file?.originalname,
    );
  }
}
