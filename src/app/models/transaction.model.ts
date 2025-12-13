export interface Transaction {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  user_id?: string | Number;
  created_at?: string;
  type?: 'income' | 'expense';
  category?: string;
  balance?: number;
  amount?: number;
}
