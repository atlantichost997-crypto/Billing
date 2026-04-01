export interface WhmcsInvoice {
  id: number;
  invoicenum: string;
  date: string;
  duedate: string;
  datepaid: string;
  subtotal: string;
  credit: string;
  tax: string;
  tax2: string;
  total: string;
  balance: string;
  status: 'Paid' | 'Unpaid' | 'Cancelled' | 'Refunded' | 'Collections';
}

export interface WhmcsService {
  id: number;
  clientid: number;
  orderid: number;
  pid: number;
  regdate: string;
  name: string;
  translated_name: string;
  groupname: string;
  domain: string;
  dedicatedip: string;
  serverips: string;
  firstpaymentamount: string;
  recurringamount: string;
  paymentmethod: string;
  paymentmethodname: string;
  billingcycle: string;
  nextduedate: string;
  status: 'Pending' | 'Active' | 'Suspended' | 'Terminated' | 'Cancelled' | 'Fraud';
  username: string;
  password?: string;
}

export interface WhmcsTicket {
  id: number;
  tid: string;
  deptid: number;
  deptname: string;
  c: string;
  date: string;
  lastreply: string;
  subject: string;
  status: 'Open' | 'Answered' | 'Customer-Reply' | 'Closed' | 'In Progress';
  priority: 'Low' | 'Medium' | 'High';
  name: string;
  email: string;
  cc: string;
  admin: string;
  attachment: string;
}

export interface WhmcsTicketReply {
  name: string;
  date: string;
  message: string;
  attachment: string;
  admin: string;
  rating: number;
}

export interface WhmcsGetInvoicesResponse {
  result: 'success' | 'error';
  totalresults: number;
  invoices: {
    invoice: WhmcsInvoice[];
  };
}

export interface WhmcsGetClientsProductsResponse {
  result: 'success' | 'error';
  totalresults: number;
  products: {
    product: WhmcsService[];
  };
}

export interface WhmcsGetTicketsResponse {
  result: 'success' | 'error';
  totalresults: number;
  tickets: {
    ticket: WhmcsTicket[];
  };
}

export interface WhmcsGetTicketResponse {
  result: 'success' | 'error';
  ticketid: number;
  tid: string;
  c: string;
  date: string;
  title: string;
  subject: string;
  status: string;
  priority: string;
  name: string;
  email: string;
  cc: string;
  replies: {
    reply: WhmcsTicketReply[];
  };
}

export interface WhmcsCreateSsoTokenResponse {
  result: 'success' | 'error';
  redirect_url: string;
}
