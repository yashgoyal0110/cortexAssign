import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/mailer.js";

export const onSignup = inngest.createFunction(
  { name: "on-user-signup", retries: 3 },
  { event: "user/signup" },

  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User do not exist");
        }
        return userObject;
      });

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to the App";
        const text = `Hello ${user.email}, welcome to cortexAssign!`;
        await sendEmail(user.email, subject, text);
      });

      return { Success: true };
    } catch (error) {
      console.error("Error in onSignup function:", error);
      return {Success: false, error: error.message};
    }
  }
);
