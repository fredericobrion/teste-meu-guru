import { SetMetadata } from '@nestjs/common';

export const ADMIN_KEY = 'admin';

export const AdminAuth = () => SetMetadata(ADMIN_KEY, true);
