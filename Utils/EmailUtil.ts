import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

class EmailUtil {
    private transporter: nodemailer.Transporter;

    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email configurations are missing in .env file');
        } else {
            console.log('Email utility initialized for:', process.env.EMAIL_USER);
        }

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 30000,
        });
    }

    public async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to: ${to}`);
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error(`Email delivery failed: ${error.message}`);
        }
    }

    public async sendOtpEmail(email: string, otp: string): Promise<void> {
        const subject = 'OTP Verification - Ticket Hive';
        const text = `Your OTP for verification is: ${otp}. It will expire in 5 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #e53e3e;">Ticket Hive Verification</h2>
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <div style="font-size: 24px; font-weight: bold; background: #f7fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p>This OTP will expire in <strong>5 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #718096;">&copy; ${new Date().getFullYear()} Ticket Hive. All rights reserved.</p>
            </div>
        `;
        await this.sendEmail(email, subject, text, html);
    }

    public async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
        const subject = 'Password Reset Request - Ticket Hive';
        const text = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #e53e3e;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>Link: <a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in <strong>30 minutes</strong>.</p>
                <p>If you did not request a password reset, no further action is required.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #718096;">&copy; ${new Date().getFullYear()} Ticket Hive. All rights reserved.</p>
            </div>
        `;
        await this.sendEmail(email, subject, text, html);
    }
}

export default new EmailUtil();
