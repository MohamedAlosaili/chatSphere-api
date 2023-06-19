import nodemailer from "nodemailer";

export const sendLoginLink = async (email: string, url: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "ChatSphere 💬 <info@chatsphere.com>",
    to: email,
    subject: "Sign in to ChatSphere 💬",
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ChatSphere Login email</title>
  </head>
  <body>
    <div
      style="
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
          'Noto Color Emoji';
        align-items: center;
        max-width: 30rem;
        margin: 0 auto;
        text-align: center;
      "
    >
      <h1 style>ChatSphere 💬</h1>

      <h3>Log in as <strong>${email}</strong> to ChatSphere</h3>

      <a
        style="
          font-size: 2rem;
          padding: 1rem 2rem;
          background-color: #000;
          color: #fff;
          border-radius: 0.5rem;
          line-height: 1;
          cursor: pointer;
          display: block;
          width: fit-content;
          margin: 0.5rem auto;
        "
        href="${url}"
        >Login</a
      >

      <p>
        The link is valid for 1 hours. You will stay logged in for 30 days. If
        you didn't request this link or you request it by mistake you can ignore
        this email
      </p>
      <p style="align-self: flex-start">
        Best regard, and enjoyable experience
      </p>
      <p style="align-self: flex-start">ChatSphere 💬 team.</p>
    </div>
  </body>
</html>

    `,
  });
};
