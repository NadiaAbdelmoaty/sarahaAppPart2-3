export const page =(OTP)=>{
    return `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #4A90E2; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Saraha App</h1>
    </div>

    <div style="padding: 30px; background-color: #ffffff; text-align: center;">
        <h2 style="color: #333;">Verification Code</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hi there! Use the following code to verify your email address. This code is valid for <strong>2 minutes</strong>.
        </p>

        <div style="margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; background-color: #f8f9fa; border: 2px dashed #4A90E2; color: #4A90E2; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
                ${OTP} </span>
        </div>

        <p style="color: #999; font-size: 12px;">
            If you didn't request this code, you can safely ignore this email.
        </p>
    </div>

    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        &copy; 2026 Saraha App. All rights reserved.
    </div>
</div>
`
}