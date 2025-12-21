import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    // Use env directly for nodemailer config as in original
    // But defineNuxtConfig runtimeConfig is cleaner.
    // We'll stick to process.env where possible for speed if keys are there.

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.CONTACT_FORM_ID,
            pass: process.env.CONTACT_FORM_KEY,
        },
    });

    const mailOptions = {
        from: `"${name}" <${process.env.CONTACT_FORM_ID}>`,
        to: process.env.CONTACT_FORM_ID,
        replyTo: email,
        subject: subject ? `EnterCinema Contact: ${subject}` : 'EnterCinema Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Contact form error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: (error as any).message || 'Error sending email'
        })
    }
})
