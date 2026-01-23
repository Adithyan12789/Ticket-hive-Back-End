import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

class EmailUtil {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    public async sendEmail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
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
        await this.sendEmail(email, 'OTP Verification', `Your OTP is: ${otp}`);
    }
}

export default new EmailUtil();
