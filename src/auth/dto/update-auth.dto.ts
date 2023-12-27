import { PartialType } from '@nestjs/mapped-types';
import { User } from './create-auth.dto';

export class UpdateRegister extends PartialType(User) {}
