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
