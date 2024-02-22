export interface IBankAccount {
    name: string;
    balance: number;
    transactions: any[] | null;
    id: string;
}

export interface IInitializeBankAccountRequest {
    name: string,
    initialAmount: number
}

export interface ITransaction {
    transactionReference: string,
    amount: number,
    createdDateTime: string,
    type: number,
    accountRunningBalance: number
}

export interface PaginatedTransactions{
    pageSize: number,
    pageNumber: number,
    totalCount: number,
    data: ITransaction[]
}

export interface IApiResponse {
    data: IBankAccount[] | ITransaction[] | PaginatedTransactions | IInitializeBankAccountResponse;
    message: string;
    success: boolean;
}

export interface IInitializeBankAccountResponse {
    id: string,
    name: string,
    accountBalance: number
}

export interface ITransactionalDataRequest {
    accountId: string,
    amount: number,
    transactionReference: string
}

export interface IDepositRequest extends ITransactionalDataRequest {
}
export interface IWithdrawalRequest extends ITransactionalDataRequest {
}