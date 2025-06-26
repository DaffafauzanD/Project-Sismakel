import { UserRole } from '../../../../common/enums/user-role.enum';

export class User {
  id!: string;
  username!: string;
  password!: string;
  id_role!: string;
  create_at?: Date;
  update_at?: Date;
  create_by?: string;
  update_by?: string;
  role?: any;
  rolePermission?: any;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}