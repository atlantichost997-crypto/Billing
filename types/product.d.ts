export interface WhmcsConfigOption {
  id: number;
  name: string;
  type: '1' | '2' | '3' | '4' | '5'; // 1: Dropdown, 2: Radio, 3: Yes/No, 4: Quantity, 5: Slider
  options: {
    option: {
      id: number;
      name: string;
      rawName: string;
      recurring: string;
      pricing: any;
    }[];
  };
}

export interface WhmcsProduct {
  pid: number;
  gid: number;
  type: string;
  name: string;
  description: string;
  module: string;
  paytype: string;
  pricing: {
    [currency: string]: {
      prefix: string;
      suffix: string;
      monthly: string;
      quarterly: string;
      semiannually: string;
      annually: string;
      biennially: string;
      triennially: string;
    };
  };
  customfields: {
    customfield: any[];
  };
  configoptions: {
    configoption: WhmcsConfigOption[];
  };
}

export interface WhmcsGetProductsResponse {
  result: 'success' | 'error';
  totalresults: number;
  products: {
    product: WhmcsProduct[];
  };
}

export interface WhmcsDomainWhoisResponse {
  result: 'success' | 'error';
  status: 'available' | 'unavailable' | 'error';
  domain: string;
  pricing?: {
    [currency: string]: {
      register: string;
      transfer: string;
      renew: string;
    }
  }
}
