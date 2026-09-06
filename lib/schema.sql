-- Ghar Kharch Strict Multi-Tenant Database Schema for MySQL / MariaDB

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  currency VARCHAR(50) DEFAULT '₹',
  number_format VARCHAR(50) DEFAULT 'indian',
  theme VARCHAR(50) DEFAULT 'dark',
  is_monthly_carry_forward_enabled TINYINT(1) DEFAULT 1,
  is_initial_setup_completed TINYINT(1) DEFAULT 1,
  default_month VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_settings (
  user_id VARCHAR(255) PRIMARY KEY,
  salary_date INT DEFAULT 1,
  expected_monthly_salary DECIMAL(15, 2) DEFAULT 0.00,
  minimum_safety_balance DECIMAL(15, 2) DEFAULT 0.00,
  repayment_strategy VARCHAR(50) DEFAULT 'balanced',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_settings_user (user_id)
);

CREATE TABLE IF NOT EXISTS account_balances (
  user_id VARCHAR(255) PRIMARY KEY,
  bank_balance DECIMAL(15, 2) DEFAULT 0.00,
  wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_balances_user (user_id)
);

CREATE TABLE IF NOT EXISTS incomes (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  received_in VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  description TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_incomes_user (user_id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  account VARCHAR(50) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expenses_user (user_id)
);

CREATE TABLE IF NOT EXISTS liabilities (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  remaining_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0.00,
  monthly_emi DECIMAL(15, 2) DEFAULT 0.00,
  due_date VARCHAR(50) NOT NULL,
  priority VARCHAR(50) DEFAULT 'Medium',
  lender_name VARCHAR(255),
  friend_name VARCHAR(255),
  interest_rate DECIMAL(5, 2),
  start_date DATE,
  end_date DATE,
  expected_return_date DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_liabilities_user (user_id)
);

CREATE TABLE IF NOT EXISTS liability_payments (
  id VARCHAR(255) PRIMARY KEY,
  liability_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  account VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_liability (liability_id)
);

CREATE TABLE IF NOT EXISTS money_transfers (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  from_account VARCHAR(50) NOT NULL,
  to_account VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transfers_user (user_id)
);

CREATE TABLE IF NOT EXISTS balance_adjustments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  account VARCHAR(50) NOT NULL,
  old_balance DECIMAL(15, 2) NOT NULL,
  new_balance DECIMAL(15, 2) NOT NULL,
  amount_change DECIMAL(15, 2) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_adjustments_user (user_id)
);

CREATE TABLE IF NOT EXISTS recurring_fixed_expenses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2),
  expected_amount DECIMAL(15, 2),
  due_date_day INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_enabled TINYINT(1) DEFAULT 1,
  is_fixed TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recurring_user (user_id)
);

CREATE TABLE IF NOT EXISTS planned_category_budgets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  planned_amount DECIMAL(15, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_budgets_user (user_id)
);

CREATE TABLE IF NOT EXISTS savings_goals (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  target_date DATE,
  icon_name VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_goals_user (user_id)
);

CREATE TABLE IF NOT EXISTS user_categories (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_custom TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_category (user_id, name),
  INDEX idx_categories_user (user_id)
);

CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  budget DECIMAL(15, 2),
  currency VARCHAR(50) DEFAULT '₹',
  cover_image TEXT,
  admin_participant_id VARCHAR(255) NOT NULL,
  participants JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_expenses (
  id VARCHAR(255) PRIMARY KEY,
  trip_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  paid_by_participant_id VARCHAR(255) NOT NULL,
  split_method VARCHAR(50) NOT NULL,
  shares JSON NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  notes TEXT,
  is_recorded_in_personal TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tripexp_trip (trip_id)
);

CREATE TABLE IF NOT EXISTS trip_settlements (
  id VARCHAR(255) PRIMARY KEY,
  trip_id VARCHAR(255) NOT NULL,
  from_participant_id VARCHAR(255) NOT NULL,
  to_participant_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Completed',
  is_recorded_in_personal TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tripsett_trip (trip_id)
);

CREATE TABLE IF NOT EXISTS houses (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  currency VARCHAR(50) DEFAULT '₹',
  monthly_budget DECIMAL(15, 2),
  owner_member_id VARCHAR(255),
  creator_member_id VARCHAR(255),
  members JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS house_expenses (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  paid_by_member_id VARCHAR(255) NOT NULL,
  split_method VARCHAR(50) NOT NULL,
  shares JSON NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  financial_treatment VARCHAR(100),
  applied_credits JSON,
  notes TEXT,
  is_recorded_in_personal TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_houseexp_house (house_id)
);

CREATE TABLE IF NOT EXISTS house_incomes (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  received_by_member_id VARCHAR(255) NOT NULL,
  paid_by_member_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  required_share DECIMAL(15, 2),
  overpayment_action VARCHAR(100),
  advance_credit_generated DECIMAL(15, 2),
  description TEXT,
  is_recorded_in_personal TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_houseinc_house (house_id)
);

CREATE TABLE IF NOT EXISTS house_settlements (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  from_member_id VARCHAR(255) NOT NULL,
  to_member_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Completed',
  is_recorded_in_personal TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_housesett_house (house_id)
);

CREATE TABLE IF NOT EXISTS house_member_credit_records (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  member_id VARCHAR(255) NOT NULL,
  member_name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  remaining_amount DECIMAL(15, 2) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Available',
  applied_to_expense_id VARCHAR(255),
  applied_to_expense_title VARCHAR(255),
  applied_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_housecred_house (house_id)
);

CREATE TABLE IF NOT EXISTS house_credit_adjustments (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  member_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_houseadj_house (house_id)
);

CREATE TABLE IF NOT EXISTS recurring_house_expenses (
  id VARCHAR(255) PRIMARY KEY,
  house_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  expected_amount DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'Monthly',
  due_date_day INT NOT NULL,
  split_method VARCHAR(50) NOT NULL,
  is_enabled TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_houserecurr_house (house_id)
);
