export interface SalaryEntry {
  id: number
  company: string
  role: string
  level: string
  location: string
  experience_years: number
  base_salary: number
  bonus: number
  stock: number
  total_compensation: number
}

export function normalizeCompany(name: string): string {
  return name?.toString().toLowerCase().trim().replace(/\s+/g, ' ') || ''
}

export function computeTotal(entry: Partial<SalaryEntry>): number {
  return (Number(entry.base_salary) || 0) + (Number(entry.bonus) || 0) + (Number(entry.stock) || 0)
}

export function formatINR(n: number | null | undefined): string {
  if (n == null) return '—'
  const v = Number(n)
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  return `₹${v.toLocaleString('en-IN')}`
}

export function formatCompany(name: string): string {
  if (!name) return '—'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const SEED_DATA: Omit<SalaryEntry, 'total_compensation'>[] = [
  { id: 1, company: 'google', role: 'Software Engineer', level: 'L5', location: 'Bangalore', experience_years: 6, base_salary: 4200000, bonus: 800000, stock: 2000000 },
  { id: 2, company: 'google', role: 'Software Engineer', level: 'L4', location: 'Hyderabad', experience_years: 3, base_salary: 2800000, bonus: 450000, stock: 1200000 },
  { id: 3, company: 'google', role: 'Software Engineer', level: 'L6', location: 'Bangalore', experience_years: 10, base_salary: 6500000, bonus: 1300000, stock: 4000000 },
  { id: 4, company: 'microsoft', role: 'Software Engineer', level: 'L62', location: 'Hyderabad', experience_years: 5, base_salary: 3800000, bonus: 600000, stock: 1500000 },
  { id: 5, company: 'microsoft', role: 'Software Engineer', level: 'L63', location: 'Bangalore', experience_years: 8, base_salary: 5200000, bonus: 900000, stock: 2800000 },
  { id: 6, company: 'microsoft', role: 'Program Manager', level: 'L62', location: 'Hyderabad', experience_years: 6, base_salary: 3500000, bonus: 700000, stock: 1600000 },
  { id: 7, company: 'amazon', role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', experience_years: 4, base_salary: 3200000, bonus: 500000, stock: 1800000 },
  { id: 8, company: 'amazon', role: 'Software Engineer', level: 'SDE3', location: 'Hyderabad', experience_years: 8, base_salary: 5000000, bonus: 800000, stock: 3500000 },
  { id: 9, company: 'amazon', role: 'Data Scientist', level: 'SDE2', location: 'Bangalore', experience_years: 5, base_salary: 3000000, bonus: 450000, stock: 1500000 },
  { id: 10, company: 'meta', role: 'Software Engineer', level: 'E5', location: 'Remote', experience_years: 7, base_salary: 5500000, bonus: 1100000, stock: 3800000 },
  { id: 11, company: 'meta', role: 'Software Engineer', level: 'E4', location: 'Bangalore', experience_years: 4, base_salary: 3600000, bonus: 700000, stock: 2200000 },
  { id: 12, company: 'flipkart', role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', experience_years: 4, base_salary: 2200000, bonus: 300000, stock: 800000 },
  { id: 13, company: 'flipkart', role: 'Software Engineer', level: 'SDE3', location: 'Bangalore', experience_years: 7, base_salary: 3500000, bonus: 500000, stock: 1500000 },
  { id: 14, company: 'flipkart', role: 'Product Manager', level: 'PM3', location: 'Bangalore', experience_years: 6, base_salary: 3200000, bonus: 600000, stock: 1200000 },
  { id: 15, company: 'swiggy', role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', experience_years: 3, base_salary: 1800000, bonus: 200000, stock: 600000 },
  { id: 16, company: 'swiggy', role: 'Software Engineer', level: 'SDE3', location: 'Bangalore', experience_years: 6, base_salary: 2800000, bonus: 400000, stock: 1200000 },
  { id: 17, company: 'stripe', role: 'Software Engineer', level: 'L3', location: 'Bangalore', experience_years: 5, base_salary: 4500000, bonus: 800000, stock: 2500000 },
  { id: 18, company: 'stripe', role: 'Software Engineer', level: 'L4', location: 'Remote', experience_years: 8, base_salary: 6200000, bonus: 1200000, stock: 4000000 },
  { id: 19, company: 'atlassian', role: 'Software Engineer', level: 'P4', location: 'Bangalore', experience_years: 4, base_salary: 2600000, bonus: 350000, stock: 900000 },
  { id: 20, company: 'atlassian', role: 'Software Engineer', level: 'P5', location: 'Bangalore', experience_years: 7, base_salary: 3800000, bonus: 600000, stock: 1800000 },
  { id: 21, company: 'uber', role: 'Software Engineer', level: 'L4', location: 'Bangalore', experience_years: 5, base_salary: 3400000, bonus: 550000, stock: 1600000 },
  { id: 22, company: 'uber', role: 'Data Scientist', level: 'L4', location: 'Hyderabad', experience_years: 4, base_salary: 2900000, bonus: 400000, stock: 1200000 },
  { id: 23, company: 'phonepe', role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', experience_years: 3, base_salary: 2000000, bonus: 250000, stock: 700000 },
  { id: 24, company: 'razorpay', role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', experience_years: 4, base_salary: 2400000, bonus: 350000, stock: 900000 },
  { id: 25, company: 'razorpay', role: 'Software Engineer', level: 'SDE3', location: 'Bangalore', experience_years: 7, base_salary: 3600000, bonus: 550000, stock: 1500000 },
]

export function getInitialRecords(): SalaryEntry[] {
  return SEED_DATA.map(r => ({ ...r, total_compensation: computeTotal(r) }))
}
