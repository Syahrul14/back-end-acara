import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml} from "../utils/mail/mail";
import { CLIENT_HOST } from "../utils/env";
import { send } from "process";

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
}

const Schmea = mongoose.Schema;

const UserSchema = new Schmea<User>({
  fullName: {
    type: Schmea.Types.String,
    required: true,
  },
  username: {
    type: Schmea.Types.String,
    required: true,
  },
  email: {
    type: Schmea.Types.String,
    required: true,
  },
  password: {
    type: Schmea.Types.String,
    required: true,
  },
  role: {
    type: Schmea.Types.String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePicture: {
    type: Schmea.Types.String,
    default: "user.jpg"
  },
  isActive: {
    type: Schmea.Types.Boolean,
    default: false,
  },
  activationCode: {
    type: Schmea.Types.String,
  }
}, {
  timestamps: true
});

UserSchema.pre("save", function (next) {
  const user = this;

  user.password = encrypt(user.password);

  next();
});

UserSchema.post("save", async function (doc, next) {
   try {
    const user = doc;
   
    console.log("Send Email to: ", user.email);

    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
    });

    await sendMail({
      from: "mr.funy408@gmail.com",
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
   } catch (error) {
    console.log("error > ", error);
   } finally {
     next();
   }

});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
