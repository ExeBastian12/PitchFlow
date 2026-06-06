import midtransClient from 'midtrans-client';

let snap: any = null;

export function getMidtransClient() {
  if (!snap) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key';
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || 'dummy_client_key';
    snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: clientKey
    });
  }
  return snap;
}
