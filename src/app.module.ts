import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { CourseModule } from './course/course.module';
import { CourseActivityModule } from './course-activity/course-activity.module';
import { UserCourseModule } from './user-course/user-course.module';
import { UserCourseActivityModule } from './user-course-activity/user-course-activity.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10, // Tempo de vida (em segundos)
          limit: 50, // Número de requisições dentro do ttl para o mesmo IP
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CourseModule,
    CourseActivityModule,
    UserModule,
    UserCourseModule,
    UserCourseActivityModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [TypeOrmConfigService, AppService],
})
export class AppModule {}
