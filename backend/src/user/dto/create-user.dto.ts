import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({ example: 'Maria', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: '(32) 99988-5689)',
    description:
      'The phone of the user. Must be in the format of (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  phone: string;

  @ApiProperty({
    example: '088.585.547-56',
    description: 'The cpf of the user',
  })
  cpf: string;

  @ApiProperty({ example: false, description: 'The role of the user' })
  @ApiPropertyOptional()
  admin?: boolean;
}
