const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Method Not Allowed');
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { name, email, subject, message } = JSON.parse(body);

            if (!name || !email || !message) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
                return;
            }

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
                subject: subject ? `EnterCinema Contacto: ${subject}` : 'Nuevo Mensaje de Contacto',
                text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
                html: `
          <h3>Nuevo Mensaje de Contacto</h3>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
            };

            await transporter.sendMail(mailOptions);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Correo enviado exitosamente' }));

        } catch (error) {
            console.error('Contact form error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                success: false,
                error: error.message,
                details: 'Check server logs for more info'
            }));
        }
    });
};
