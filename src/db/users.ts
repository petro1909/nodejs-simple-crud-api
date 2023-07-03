import { User } from '../types/user';
import { v4 } from 'uuid';
import { userNames } from './userNames';
import { interests } from './hobbies';

export class UserRepository {
  private users: Array<User> = [];
  private namesLength = userNames.length;
  private hobbiesLength = interests.length;

  getUsers(): Array<User> {
    return this.users;
  }

  createRandomUsers() {
    const userCount = Math.floor(Math.random() * 10);
    for (let i = 0; i < userCount; i++) {
      this.users.push(this.createRandomUser());
    }
  }
  createRandomUser(): User {
    const userId = v4();
    const userName = userNames[Math.floor(Math.random() * (this.namesLength - 1))] as string;
    const userAge = Math.floor(Math.random() * 50);
    const userHobbies: Array<string> = [];
    const userHobbiesCount = Math.random() * 4;
    for (let i = 0; i < userHobbiesCount; i++) {
      const userHobbie = interests[Math.floor(Math.random() * (this.hobbiesLength - 1))] as string;
      // if (userHobbies.includes(userHobbie)) {
      // while (userHobbies.includes(userHobbie)) {
      //   userHobbie = interests[Math.random() * (uHobbies - 1)] as string;
      // }
      // }
      userHobbies.push(userHobbie);
    }
    const user: User = {
      id: userId,
      username: userName,
      age: userAge,
      hobbies: userHobbies,
    };
    return user;
  }
}
