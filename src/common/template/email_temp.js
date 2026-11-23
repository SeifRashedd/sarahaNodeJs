// plain HTML email template — no external libraries
// inline styles + tables because most email clients (Gmail, Outlook) ignore <style> and flexbox

// userName comes from user input, so escape it before putting it inside HTML
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char])


export const emailTemp = ({ title, userName, message }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">

                    <!-- header -->
                    <tr>
                        <td style="background-color:#4f46e5; padding:28px 32px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;">Saraha</h1>
                        </td>
                    </tr>

                    <!-- body -->
                    <tr>
                        <td style="padding:32px;">
                            <h2 style="margin:0 0 16px; color:#111827; font-size:20px;">${escapeHtml(title)}</h2>
                            <p style="margin:0 0 12px; color:#374151; font-size:16px; line-height:1.6;">Hello ${escapeHtml(userName)} 👋</p>
                            <p style="margin:0; color:#374151; font-size:16px; line-height:1.6;">${escapeHtml(message)}</p>
                        </td>
                    </tr>

                    <!-- footer -->
                    <tr>
                        <td style="padding:20px 32px; border-top:1px solid #e5e7eb; text-align:center;">
                            <p style="margin:0; color:#9ca3af; font-size:13px;">© ${new Date().getFullYear()} Saraha. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
