/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/main/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User not found with email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // remove password before returning user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
}
