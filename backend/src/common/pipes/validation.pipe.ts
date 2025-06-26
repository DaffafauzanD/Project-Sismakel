import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Basic validation - in a real app, you'd use class-validator
    if (value === undefined || value === null) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
} 