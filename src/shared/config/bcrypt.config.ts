import bcrypt from "bcrypt"


export class BcryptAdapter {

  private readonly SALT_ROUNDS = 10

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS)
    return bcrypt.hash(password, salt)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
