import { DataTypes, type Sequelize, Model, type Optional } from "sequelize";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  //exclamation is used due to not having constructor, TS will complain else.
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  // optionals VV
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Hash the password before saving the user
  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
  public async isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}



export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 25],
            msg: "Username must be between 3 and 25 characters long.",
          },
        }
      },
      email: {
        type: DataTypes.STRING, //TODO: need to add validation on these
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Must be a valid email address.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      sequelize,
      hooks: {
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            await user.setPassword(user.password);
          }
        },
      },
    }
  );

  return User;
}
