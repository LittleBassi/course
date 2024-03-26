import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import {
  applyDecorators,
  ConflictException,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/user/entities/user.entity';
import { createFolder } from './utils.constants';

export function Decorator(
  apiTag: string,
  operationSummary?: string,
  operationId?: string
): MethodDecorator {
  return applyDecorators(
    UsePipes(ValidationPipe),
    ApiTags(apiTag),
    ApiOperation({
      summary: operationSummary,
      operationId,
    }),
    ApiCreatedResponse({ description: 'Operação realizada com sucesso.' }),
    ApiBadRequestResponse({
      description: 'Dados inválidos. Verifique os campos preenchidos.',
    }),
    ApiForbiddenResponse({ description: 'Acesso não autorizado.' }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' }),
    ApiConflictResponse({
      description: 'Operação incorreta ou não permitida.',
    }),
    ApiInternalServerErrorResponse({
      description: 'Erro interno no servidor. Entre em contato com o administrador.',
    })
  );
}

export function AuthDecorator(isAdmin?: boolean): MethodDecorator {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata(IS_ADMIN, isAdmin),
    ApiBearerAuth('JWT'),
    ApiHeader({
      name: 'Authorization',
      required: true,
      schema: { example: 'Bearer <access_token>' },
    })
  );
}

export function UploadDecorator(
  multipartFileName: string,
  multipartFolderName: string
): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FileInterceptor(multipartFileName, {
        storage: diskStorage({
          destination: async function (_req: any, _file: any, callback: any) {
            const caminho = createFolder(multipartFolderName);
            callback(null, caminho);
          },
          filename: (_req: any, file: any, callback: any) => {
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (_req, file, callback) => {
          if (!file.originalname.match(/\.(pdf)$/)) {
            return callback(new ConflictException('Extensão de arquivo não permitida!'), false);
          }
          callback(null, true);
        },
      })
    )
  );
}

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();

  // Passport automatically creates a user object, based on the value we return from the jwt validate() method
  return req.user;
});

// Metadata
export const IS_ADMIN = 'isAdmin';
