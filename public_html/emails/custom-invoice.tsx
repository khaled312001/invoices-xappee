import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Row,
  Column,
  Img,
  Button,
  Link,
} from "@react-email/components";
import { CustomInvoice } from "@/types/invoice";
import { format, getWeek } from "date-fns";
import { enUS } from "date-fns/locale";

interface Props {
  invoice: CustomInvoice, client: any, sender: any
}

const CustomInvoiceEmail = ({ invoice, client, sender }: Props) => {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .responsive-column {
              width: 100% !important;
              display: block !important;
            }
            .responsive-container {
              width: 100% !important;
              padding: 10px !important;
            }
          }
        `}</style>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Column align="center">
              <img
                src={sender.imageUrl ? (process.env.NEXT_PUBLIC_SERVER + sender.imageUrl) : "/logo.png"}
                alt={sender.busineesName ?? sender.name}
                width={150}
                height={50}
              />
            </Column>
          </Section>
          <Section style={styles.addresses}>
            <Text style={styles.invoiceTitle}>
              £{parseFloat(String(invoice.total)).toFixed(2)} <br />
              <br />
              <span style={styles.invoiceId}>
                <strong style={styles.invoiceIdLabel}>INV- </strong>{invoice._id}
              </span>
            </Text>
            {/* <Text style={styles.detailText}>
              For a more detailed invoice and fees breakdown, please visit your
              Xappee dashboard
            </Text>
            {/* <Text style={styles.linkText}>
              <Link
                href={`https://invoices.xappee.com/print/${invoice._id}/fulfillment`}
                style={styles.link}
              >
                https://invoices.xappee.com/print/{invoice._id}/fulfillment
              </Link>
            </Text>
            <Link
              href={`https://invoices.xappee.com/print/${invoice._id}/fulfillment`}
              style={styles.buttonLink}
            >
              <Button style={styles.button}>
                Open Dashboard <span style={styles.buttonIcon}>&#8599;</span>
              </Button>
            </Link> */}
          </Section>
          <Section style={styles.addresses}>
            <Row>
              <Column style={styles.addressColumn}>
                <Text style={styles.addressTitle}>Post To</Text>
                <Text style={styles.addressText}>
                  {invoice.client} <br />
                  {client.address ?? ''}
                </Text>
              </Column>
              <Column style={styles.addressColumn} align="right">
                <Text style={styles.addressTitle}>Post From</Text>
                <Text style={styles.addressText}>
                  {sender.busineesName ?? sender.name} <br />
                  {sender.address ?? ''} <br />
                  {sender.taxNo ? `Tax Number: ${sender.taxNo}` : ''} <br />
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={styles.orderInfo}>
            <Column>
              <Text style={styles.orderDateText}>
                <span style={styles.orderDateHighlight}>
                  INVOICED ON{" "}
                  {format(new Date(invoice.date), "MMM dd, yyyy")}
                </span>
              </Text>
            </Column>
          </Section>


          <Section style={styles.totals}>
            <Row>
              <Text style={styles.totalsText}>
                <Column>Items</Column>
                <Column style={styles.totalsAmount}>
                  {invoice.itemsNo}
                </Column>
              </Text>
            </Row>
            <Row>
              <Text style={styles.totalsText}>
                <Column>SubTotal</Column>
                <Column style={styles.totalsAmount}>
                  £{invoice.subtotal.toFixed(2)}
                </Column>
              </Text>
            </Row>
            <Row>
              <Text style={styles.totalsText}>
                <Column>Tax Rate (%)</Column>
                <Column style={styles.totalsAmount}>
                  {invoice.taxRate.toFixed(2)}
                </Column>
              </Text>
            </Row>
            <Row>
              <Text style={styles.totalsText}>
                <Column>Discount {invoice.discount > 0 ? invoice.discountType == "fixed" ? "(Fixed)" : "(Percentage)" : ""}</Column>
                <Column style={styles.totalsAmount}>
                  {invoice.discount.toFixed(2)}
                </Column>
              </Text>
            </Row>
            <Row>
              <Text style={styles.totalsText}>
                <Column>Total</Column>
                <Column style={styles.totalsAmount}>
                  £{invoice.total.toFixed(2)}
                </Column>
              </Text>
            </Row>

          </Section>

          <Section style={styles.footer}>
            <Column align="center">
              <Text style={styles.footerText}>
                {/* Thank you for dealing with Xappee! <br /> Happy Trading. */}
                Thank you for dealing with {sender.busineesName ?? sender.name}! <br />
              </Text>
              <Img
                src={sender.imageUrl ? process.env.NEXT_PUBLIC_SERVER + sender.imageUrl : "/logo.png"}
                alt={sender.busineesName ?? sender.name}
                width={100}
                height={35}
              />
              <Text style={styles.copyrightText}>
                Copyright © 2023 {sender.busineesName ?? sender.name}.
              </Text>
              {/* <div style={styles.footerLinks}>
                <Link href="#" style={styles.footerLink}>
                  Privacy Policy
                </Link>
                <span style={styles.footerDot}>•</span>
                <Link href="#" style={styles.footerLink}>
                  Contact Us
                </Link>
              </div> */}
            </Column>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CustomInvoiceEmail;

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    color: "black",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff",
  },
  container: {
    margin: "0 auto",
    padding: "20px",
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
  },
  header: {
    padding: "20px 0",
    textAlign: "center" as const,
  },
  addresses: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8f8f8",
    margin: "20px 0",
  },
  addressColumn: {
    width: "50%",
    padding: "0 10px",
  },
  addressTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  addressText: {
    fontSize: "14px",
    lineHeight: "1.5",
  },
  orderInfo: {
    padding: "10px 20px",
    backgroundColor: "#f8f8f8",
    borderRadius: "10px",
    textAlign: "center" as const,
  },
  orderDateText: {
    fontSize: "20px",
    fontWeight: "500",
  },
  orderDateHighlight: {
    fontWeight: "bold",
    color: "#000",
  },
  totals: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f8f8f8",
    borderRadius: "10px",
  },
  totalsText: {
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "10px",
  },
  totalAmount: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  totalsAmount: {
    textAlign: "right" as const,
  },
  textleft: {
    textAlign: "left" as const,
  },
  footer: {
    margin: "20px 0",
    padding: "20px",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "14px",
    color: "#666666",
  },
  invoiceTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center" as const,
  },
  invoiceId: {
    fontWeight: "normal",
    fontSize: "14px",
    textAlign: "center" as const,
  },
  invoiceIdLabel: {
    opacity: 0.8,
  },
  detailText: {
    fontSize: "14px",
    textAlign: "center" as const,
  },
  linkText: {
    fontSize: "12px",
    textAlign: "center" as const,
  },
  link: {
    color: "#ef4444",
  },
  buttonLink: {},
  button: {
    margin: "0 25%",
    display: "block",
    width: "fit",
    textAlign: "center" as const,
    backgroundColor: "black",
    border: "none",
    padding: "16px",
    color: "white",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  buttonIcon: {
    marginLeft: "5px",
  },
  footerLinks: {
    marginTop: "10px",
  },
  footerLink: {
    color: "#666666",
    textDecoration: "none",
  },
  footerDot: {
    margin: "0 5px",
  },
  copyrightText: {
    fontSize: "12px",
    color: "#666666",
    marginTop: "10px",
  },
};
