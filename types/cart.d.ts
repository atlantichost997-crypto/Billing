export interface CartItem {
  id: string; // Unique local ID for the cart item
  type: 'product' | 'domain';
  pid?: number; // Product ID
  domain?: string; // Domain name
  name: string;
  price: number;
  billingcycle: 'monthly' | 'quarterly' | 'semiannually' | 'annually' | 'biennially' | 'triennially';
  configoptions?: Record<number, number>; // WHMCS config options: { [optionId]: valueId }
}

export interface CartState {
  items: CartItem[];
  promocode: string | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  clearCart: () => void;
  getTotal: () => number;
}

export interface WhmcsAddOrderResponse {
  result: 'success' | 'error';
  message?: string;
  orderid: number;
  productids: string;
  addonids: string;
  domainids: string;
  invoiceid: number;
}

export interface WhmcsGetPromotionsResponse {
  result: 'success' | 'error';
  promotions: {
    promotion: {
      code: string;
      type: string;
      value: string;
      recurring: string;
      active: string;
    }[];
  };
}
