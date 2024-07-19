import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'maria@email.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'senha123*',
    description: 'The password of the user. Must have at least 6 characters',
  })
  password: string;
}
