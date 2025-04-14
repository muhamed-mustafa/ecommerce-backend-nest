import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.registerAsync(({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return {
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions:{ expiresIn: configService.get<string>('JWT_EXPIRATION')}
            }
        },

    }))],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
