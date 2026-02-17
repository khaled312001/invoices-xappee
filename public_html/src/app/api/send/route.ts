import { Fetch } from "@/lib/actions/fetch";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from 'fs';

export async function POST(request: Request) {
  try {

    const { userEmail, invoice, emailHtml, subject } = await request.json();
    if (!userEmail || !invoice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // if(invoice["StorageInvoicePerItem"]){
    //   const currentDate = new Date();
    //   const storageStartMonth = currentDate.getMonth()+1;

    //   const { ok } = await Fetch(`clients/update/${userEmail}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     cache: "no-store",
    //     body: JSON.stringify({ storageStartMonth: storageStartMonth }),
    //   });
      // if (ok) {
      //   return true;
      // } else {
      //   return false;
      // }


    // }

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_USER_PASSWORD,
      },
      logger: false,
      debug: false,
    });

    // Render React component to HTML string

    // Send email
    let info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to:  userEmail,
      subject: subject ?? "FBX INVOICE REMINDER",
      text: subject ?? "FBX INVOICE REMINDER",
      html: emailHtml,
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Error sending email:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
