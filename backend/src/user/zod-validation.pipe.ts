import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(metadata);
    // console.log(value);
    if (metadata.type === 'body') {
      try {
        return this.schema.parse(value);
      } catch (e) {
        throw new BadRequestException(e.errors);
      }
    } else {
      return value;
    }
  }
}
