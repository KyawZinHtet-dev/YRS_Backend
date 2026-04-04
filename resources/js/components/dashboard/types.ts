export interface SummaryData {
    totalUsers: number;
    newUsersThisMonth: number;
    totalTickets: number;
    ticketsThisMonth: number;
    activeTickets: number;
    expiredTickets: number;
    totalRevenue: number;
    revenueThisMonth: number;
    totalTransactions: number;
    transactionsThisMonth: number;
    totalTopUps: number;
    topUpsThisMonth: number;
    pendingTopUps: number;
    isFiltered?: boolean;
    filterMonth?: string;
    selectedYear?: string;
    selectedMonth?: string;
}

export interface MonthlyData {
    userRegistrations: Array<{ label: string; count: number }>;
    ticketSales: Array<{ label: string; count: number; revenue: number }>;
    monthlyRevenue: Array<{ label: string; manual: number; top_up: number; buy_ticket: number }>;
    transactionTypes: Array<{ type: string; count: number }>;
    ticketTypes: Array<{ type: string; count: number }>;
    transactionMethods: Array<{ method: string; count: number }>;
}

export interface MonthOption {
    value: string;
    label: string;
}

export interface YearOption {
    value: string;
    label: string;
}
