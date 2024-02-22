import axios from 'axios';
import { IDepositRequest, IWithdrawalRequest } from '../models/interfaces';

const API_URL = process.env.REACT_APP_BASE_API_URL;

const getTransactionsHistory = async (id: string, page: number, pageSize: number) => {
  try {
    const response = await axios.get(`${API_URL}/Transactions/${id}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.log('Failed to get transactions history')
    throw new Error('Failed to get transactions history');
  }
};

const createDepositAsync = async (request: IDepositRequest) => {
  try {
    const response = await axios.post(`${API_URL}/Transactions/deposit`, request);
    return response.data;
  } catch (error) {
    console.log('Failed to create deposit')
    throw new Error('Failed to create deposit');
  }
};

const createWithdrawalAsync = async (request: IWithdrawalRequest) => {
  try {
    const response = await axios.post(`${API_URL}/Transactions/withdraw`, request);
    return response.data;
  } catch (error) {
    console.log('Failed to create withdrawal')
    throw new Error('Failed to create withdrawal');
  }
};


export { getTransactionsHistory, createDepositAsync, createWithdrawalAsync };