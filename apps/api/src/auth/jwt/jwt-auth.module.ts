import { Module } from '@nestjs/common';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
