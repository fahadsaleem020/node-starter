import { env } from "./env.util";

const logo = env.BACKEND_DOMAIN + "/logo.svg";

export const signupTemplate = ({ user, url }: { user: any; url: string }) => `
  <div style="font-family: Arial, sans-serif; background: #f7f9fb; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${logo}" alt="PlanFlo Logo" style="width: 80px; margin-bottom: 8px;" />
        <h2 style="margin: 0; color: #1a202c;">Welcome to PlanFlo!</h2>
      </div>
      <p style="font-size: 18px; color: #333;">Hi <b>${user.name}</b>,</p>
      <p style="font-size: 16px; color: #333;">
        Thank you for signing up for <b>PlanFlo</b>! Please verify your email address to activate your account.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="display: inline-block; background: #2563eb; color: #fff; font-size: 18px; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="font-size: 15px; color: #555;">
        If you did not request this, you can safely ignore this email.<br>
        This link will expire in <b>1 hour</b>.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="font-size: 14px; color: #888;">
        Need help? Contact our support team at <a href="mailto:support@planflo.com" style="color: #2563eb;">support@planflo.com</a>.
      </p>
      <p style="font-size: 13px; color: #bbb; text-align: center; margin-top: 24px;">
        &copy; ${new Date().getFullYear()} PlanFlo. All rights reserved.
      </p>
    </div>
  </div>
`;
