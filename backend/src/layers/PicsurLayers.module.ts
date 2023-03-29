import { Module } from '@nestjs/common';
import { MainExceptionFilter } from './exception/exception.filter';
import { SuccessInterceptor } from './success/success.interceptor';
import { ZodValidationPipe } from './validate/zod-validator.pipe';

@Module({
  providers: [MainExceptionFilter, SuccessInterceptor, ZodValidationPipe],
  exports: [MainExceptionFilter, SuccessInterceptor, ZodValidationPipe],
})
export class PicsurLayersModule {}
