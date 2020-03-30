import mongoose from 'mongoose';

import {User, IUser} from '../models/user';
import {IDecodedToken} from './authentication';

export class AuthenticatedUser {
  public readonly _id: string;
  public readonly role: string;

  constructor({role, _id}: IDecodedToken) {
    this._id = _id;
    this.role = role;
  }

  public async getUserFromDB(): Promise<IUser | null> {
    return await User.findById(this._id);
  }

  public async isVerified(): Promise<boolean> {
    const user = await User.findById(this._id).select('isVerified');
    return !!user && user.isVerified;
  }

  public getObjectID(str: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(str);
  }
}
