export type Plan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  description?: string;
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    price: 0,
    currency: 'RWF',
    interval: 'month',
    description: 'Essential access to start using IsokoHealth.',
    features: ['2 consultations per month', 'Health dashboard', 'Reminders & alerts'],
  },
  {
    id: 'plan-standard',
    name: 'Standard',
    price: 5000,
    currency: 'RWF',
    interval: 'month',
    description: 'Full telemedicine access with monitoring.',
    popular: true,
    features: ['Unlimited consultations', 'IoT device tracking', 'Digital lab results', 'Priority scheduling'],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    price: 15000,
    currency: 'RWF',
    interval: 'month',
    description: 'AI-powered insights and premium care.',
    features: ['Everything in Standard', 'AI insights', 'Priority doctor access', 'Diagnostics bundle', 'Caregiver dashboard'],
  },
];

export const listPlans = async () => plans;
