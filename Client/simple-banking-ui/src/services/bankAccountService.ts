import axios from 'axios';
import { IInitializeBankAccountRequest } from '../models/interfaces';

const API_URL = process.env.REACT_APP_BASE_API_URL;

const getBankAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/BankAccount`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch bank accounts');
  }
};

const initializeBankAccountAsync = async (request: IInitializeBankAccountRequest) => {
  try {
    const response = await axios.post(`${API_URL}/BankAccount/initialize`, request);
    return response.data;
  } catch (error) {
    console.log('Failed to initialize bank account')
    throw new Error('Failed to initialize bank account');
  }
};

export { getBankAccounts, initializeBankAccountAsync };
