// models/security/profile.model.ts
import { User } from './user.model';
import { Person } from './person.model';

export interface UserProfile {
  user: User;
  person: Person;
}
