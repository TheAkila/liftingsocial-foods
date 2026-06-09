import { createHash } from "crypto";

export type PayHereCheckoutPayload = {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

const md5Upper = (input: string) =>
  createHash("md5").update(input).digest("hex").toUpperCase();

/**
 * PayHere checkout hash. Format per PayHere docs:
 * md5(merchant_id + order_id + amount + currency + md5(merchant_secret))
 * Amount must be formatted to 2 decimal places with no thousand separators.
 */
export function buildCheckoutHash(opts: {
  merchantId: string;
  merchantSecret: string;
  orderId: string;
  amount: number;
  currency: string;
}): string {
  const amountFormatted = opts.amount.toFixed(2);
  const secretHash = md5Upper(opts.merchantSecret);
  return md5Upper(
    opts.merchantId + opts.orderId + amountFormatted + opts.currency + secretHash
  );
}

/**
 * Verify the IPN signature PayHere sends to the notify URL. Format:
 * md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret))
 */
export function verifyNotifyHash(opts: {
  merchantId: string;
  merchantSecret: string;
  orderId: string;
  amount: string;
  currency: string;
  statusCode: string;
  receivedSig: string;
}): boolean {
  const secretHash = md5Upper(opts.merchantSecret);
  const expected = md5Upper(
    opts.merchantId +
      opts.orderId +
      opts.amount +
      opts.currency +
      opts.statusCode +
      secretHash
  );
  return expected === opts.receivedSig.toUpperCase();
}

export const PAYHERE_CHECKOUT_URL =
  process.env.PAYHERE_MODE === "live"
    ? "https://www.payhere.lk/pay/checkout"
    : "https://sandbox.payhere.lk/pay/checkout";
