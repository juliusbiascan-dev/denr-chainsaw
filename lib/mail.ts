const domain = process.env.NEXT_PUBLIC_APP_URL;

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await sendEmail({
    to: email,
    subject: "DENR - Two-Factor Authentication Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p style="margin-bottom: 20px;">Your two-factor authentication code is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${token}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This code will expire shortly. Do not share this code with anyone.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await sendEmail({
    to: email,
    subject: "DENR - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>A password reset was requested for your DENR account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in 24 hours for security purposes.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await sendEmail({
    to: email,
    subject: "DENR - Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Thank you for registering with the DENR System. To complete your registration, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in 24 hours for security purposes.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};

export const sendTeamInvitationEmail = async (
  email: string,
  role: string,
  labId: string,
  token?: string,
) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const link = token
    ? `${domain}/auth/register?token=${token}&labId=${labId}`
    : `${domain}/teams/accept?labId=${labId}`;

  await sendEmail({
    to: email,
    subject: "DENR - Team Member Invitation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #006400; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #006400; margin-bottom: 10px;">Department of Environment and Natural Resources</h2>
          <div style="width: 100%; height: 2px; background-color: #006400; margin: 10px 0;"></div>
        </div>
        <p>Greetings,</p>
        <p>You have been invited to join the DENR system as a <strong>${role.toLowerCase()}</strong>.</p>
        ${token
        ? '<p>As a new user, you will need to create an account to access the system.</p>'
        : '<p>Please click the button below to accept this invitation and join the team.</p>'
      }
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="background-color: #006400; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block;">
            ${token ? 'Create DENR Account' : 'Accept Invitation'}
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This invitation link will expire in 24 hours and can only be used once for security purposes.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          If you did not expect this invitation, please ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          This is an automated message from the DENR System. Please do not reply to this email.
        </div>
      </div>
    `
  });
};
