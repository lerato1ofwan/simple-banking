import React, { useEffect, useState } from 'react'
import PageTitle from './Typography/PageTitle'
import BankAccount from './BankAccount'
import { createDepositAsync, createWithdrawalAsync, getTransactionsHistory } from '../services/transactionsServices'
import { IApiResponse, ITransaction, PaginatedTransactions } from '../models/interfaces'
import { formatDate } from '../utils/helpers'
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Modal from './Modal'
import ClosingAlert from './Alert'
import Loader from './Loader'

function Dashboard() {
    // Paging Properties (Transactions history)
    const [page, setPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalItems, setTotalItems] = useState<number>(0);

    // State properties (transactions, modal, alert, transactions, card, selectedBankAccount, form fields)
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showAlertText, setShowAlertText] = useState<string>('');
    const [alertType, setAlertType] = useState<string>('');

    const [cardComponent, setCardComponent] = useState<JSX.Element | null>(null);

    const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');

    const [amount, setAmount] = useState<number>(0);
    const [transactionReference, setTransactionReference] = useState<string>('');

    useEffect(() => {
        if (selectedBankAccountId && selectedBankAccountId !== '') {
            fetchTransactions(false);
        }
    }, [page, itemsPerPage, selectedBankAccountId]);

    const renderAlert = (message: string, type: string) => {
        setShowAlert(true)
        setShowAlertText(message);
        setAlertType(type);
        setTimeout(() => {
            setShowAlert(false)
            setShowAlertText('');
            setAlertType('');
        }, 5000)
    }

    const renderDeposit = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setModalTitle('Deposit')
        setCardComponent(
            <Card color="transparent" shadow={false} placeholder=''>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography placeholder variant="h6" color="blue-gray" className="-mb-3">
                            Amount
                        </Typography>
                        <Input
                            crossOrigin
                            size="lg"
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            placeholder='R 0.00'
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                        <Typography placeholder='' variant="h6" color="blue-gray" className="-mb-3">
                            Transaction Reference
                        </Typography>
                        <Input
                            size="lg"
                            crossOrigin
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={(e) => setTransactionReference(e.target.value)}
                        />
                    </div>
                </form>
            </Card>
        );
        setShowModal(true);
    };

    const handleDepositAsync = async () => {
        try {
            validateTransactionData(amount, transactionReference);

            if (amount > 0 && amount <= 500) {
                var depositResponse = await createDepositAsync({ amount, transactionReference, accountId: selectedBankAccountId });

                if (depositResponse?.success) {
                    setAmount(0);
                    setTransactionReference('');
                    setShowModal(false);

                    renderAlert(depositResponse.message, "success");

                    await fetchTransactions(false)
                } else {
                    setAmount(0);
                    setTransactionReference('');

                    setShowModal(false);
                    renderAlert(depositResponse.message, "warning");
                }
            } else {
                setAmount(0);
                setTransactionReference('');

                setShowModal(false);
                renderAlert('Amount must be greater than 0 and less than or equal to R 500', "warning");
            }
        } catch (error) {
            console.error('Error depositing amount:', error);
            renderAlert('Server failed to deposit, unknown error, please contact server admin if problem persists', "error");
        }
    };
    const handleWithdrawAsync = async () => {
        try {
            validateTransactionData(amount, transactionReference);
            if (amount > 0) {
                var withdrawResponse = await createWithdrawalAsync({ amount, transactionReference, accountId: selectedBankAccountId });

                if (withdrawResponse?.success) {
                    setAmount(0);
                    setTransactionReference('');

                    setShowModal(false);
                    renderAlert(withdrawResponse.message, "success");

                    await fetchTransactions(false)
                } else {
                    setAmount(0);
                    setTransactionReference('');

                    setShowModal(false);
                    renderAlert(withdrawResponse.message, "warning");
                }
            } else {
                setAmount(0);
                setTransactionReference('');

                setShowModal(false);
                renderAlert('Cannot withdraw an amount less than or equal to R0.00', "warning");
            }
        } catch (error) {
            console.error('Error withdrawaing amount:', error);

            renderAlert('Server failed to withdraw, unknown error, please contact server admin if problem persists', "error");
        }
    };

    const validateTransactionData = (amount: number, transactionReference: string) => {
        if (isNaN(amount)) {
            renderAlert('Amount must be a valid number', "warning");
            return;
        }
        if (!amount || !transactionReference) {
            const errorText = !amount && !transactionReference
                ? "Amount and transaction reference are required"
                : !amount
                    ? "Amount is required"
                    : "Transaction reference is required";

            renderAlert(errorText, "warning");
            return;
        }
    }

    const renderWithdraw = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setModalTitle('Withdraw')
        setCardComponent(
            <Card color="transparent" shadow={false} placeholder>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography placeholder variant="h6" color="blue-gray" className="-mb-3">
                            Amount
                        </Typography>
                        <Input
                            crossOrigin
                            size="lg"
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            placeholder='R 0.00'
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                        <Typography placeholder='' variant="h6" color="blue-gray" className="-mb-3">
                            Transaction Reference
                        </Typography>
                        <Input
                            size="lg"
                            crossOrigin
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            onChange={(e) => setTransactionReference(e.target.value)}
                        />
                    </div>
                </form>
            </Card>
        );
        setShowModal(true);
    };

    const fetchTransactions = async (showDialogs: boolean = true) => {
        setTransactionsLoading(true);
        if (selectedBankAccountId) {
            try {
                var result: IApiResponse = await getTransactionsHistory(selectedBankAccountId, page, itemsPerPage);

                if (result.success) {
                    if (showDialogs)
                        renderAlert(result.message, "warning");

                    const response = result.data as PaginatedTransactions;
                    const transactionsResponse = response.data as ITransaction[];
                    const { totalCount, pageNumber, pageSize } = response;
                    setItemsPerPage(pageSize)
                    setTotalItems(totalCount)
                    setPage(pageNumber)

                    setTransactions(transactionsResponse as ITransaction[]);
                } else {
                    if (showDialogs)
                        renderAlert(result.message, "warning");
                }
            } catch (error) {
                console.error('Error getting transactions history:', error);
                if (showDialogs)
                    renderAlert('Server failed to get transactions history, unknown error, please contact server admin if problem persists', "error");
            }
        } else {
            if (showDialogs)
                renderAlert('Failed to get transactions history, no bank account selected', "error");
        }

        setTransactionsLoading(false);
    };

    const goToTransactionsHistory = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        await fetchTransactions();
    };

    const closeModal = () => {
        setModalTitle('')
        setShowModal(false);
    };

    const submitForm = () => {
        if (modalTitle === 'Deposit')
            handleDepositAsync();
        else if (modalTitle === 'Withdraw')
            handleWithdrawAsync();

        setModalTitle('')
        setShowModal(false);
    };

    const closeAlert = () => {
        setShowAlertText('');
        setShowAlert(!showAlert)
    };

    const goToPage = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const goToFirstPage = () => {
        goToPage(1);
    };

    const goToLastPage = () => {
        goToPage(totalPages);
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            goToPage(page + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            goToPage(page - 1);
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setPage(1);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <>
            <Modal show={showModal} onClose={closeModal} onSubmit={submitForm} title={modalTitle} cardComponent={cardComponent} />

            {showAlert && <ClosingAlert onClose={closeAlert} text={showAlertText} type={alertType} />}

            <PageTitle>Dashboard</PageTitle>

            <BankAccount setSelectedAccountId={setSelectedBankAccountId} fetchTransactions={fetchTransactions} />

            {selectedBankAccountId &&
                <>
                    <div className="relative w-full">
                        <hr className="w-full h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/5000/svg" fill="currentColor" viewBox="0 0 18 14">
                                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                            </svg>
                            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/5000/svg" fill="currentColor" viewBox="0 0 18 14">
                                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                            </svg>
                        </div>
                    </div>

                    <PageTitle>Actions</PageTitle>
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

                        <div onClick={(e) => renderDeposit(e)} className='cursor-pointer flex rounded bg-gray-800 p-4 rounded justify-around items-center'>
                            <Button size="lg" className='px-6 py-3.5 text-base font-medium inline-flex outline-none focus:ring-blue-300 rounded-lg text-purple-700 hover:text-white border border-purple-700' placeholder="">Deposit</Button>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Load up some cash</p>
                        </div>


                        <div onClick={(e) => renderWithdraw(e)} className='cursor-pointer flex rounded bg-gray-800 p-4 rounded justify-around items-center'>
                            <Button size="lg" className='px-6 py-3.5 text-base font-medium inline-flex outline-none focus:ring-blue-300 rounded-lg text-purple-700 hover:text-white border border-purple-700' placeholder="">Withdraw</Button>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Get some cash</p>
                        </div>

                        <div onClick={(e) => goToTransactionsHistory(e)} className='cursor-pointer flex rounded bg-gray-800 p-4 rounded justify-around items-center'>
                            <Button size="lg" className='px-6 py-3.5 text-base font-medium inline-flex outline-none focus:ring-blue-300 rounded-lg text-purple-700 hover:text-white border border-purple-700' placeholder="">Transactions History</Button>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">View All</p>
                        </div>
                    </div>

                    {transactions?.length > 0 && (
                        <>
                            <PageTitle>Transactions History</PageTitle>

                            {transactionsLoading ?
                                <Loader />
                                :
                                <div className="flex flex-col text-white bg-gray-800 rounded">
                                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                            <div className="overflow-hidden">
                                                <table className="min-w-full text-left text-sm font-light">
                                                    <thead className="border-b dark:border-neutral-500 uppercase tracking-widest">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-4">Transaction Reference</th>
                                                            <th scope="col" className="px-6 py-4">Date</th>
                                                            <th scope="col" className="px-6 py-4">Type</th>
                                                            <th scope="col" className="px-6 py-4">Amount</th>
                                                            <th scope="col" className="px-6 py-4">Running Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {transactions?.map((transaction, i) => (
                                                            <tr key={i} className="border-b dark:border-neutral-500">
                                                                <td className="whitespace-nowrap px-6 py-4 font-medium"><span className="text-sm">{transaction.transactionReference}</span></td>
                                                                <td className="whitespace-nowrap px-6 py-4">   <span className="text-sm">{formatDate(new Date(transaction.createdDateTime))}</span></td>
                                                                <td className="whitespace-nowrap px-6 py-4"> <span className="text-sm">{transaction.type}</span></td>
                                                                <td className="whitespace-nowrap px-6 py-4">  <span className="text-sm">R {transaction.amount.toFixed(2)}</span></td>
                                                                <td className="whitespace-nowrap px-6 py-4">         <span className="text-sm">R {transaction.accountRunningBalance.toFixed(2)}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {totalPages > 1 && (
                                                <div className="flex justify-center my-4 space-x-4">
                                                    <Button onClick={goToFirstPage} placeholder=''>First</Button>
                                                    <Button onClick={goToPreviousPage} placeholder=''>Previous</Button>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                                        <Button
                                                            key={pageNumber}
                                                            onClick={() => goToPage(pageNumber)}
                                                            placeholder=''
                                                            className={pageNumber === page ? 'bg-purple-400 text-white' : ''}
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    ))}
                                                    <Button onClick={goToNextPage} placeholder=''>Next</Button>
                                                    <Button onClick={goToLastPage} placeholder=''>Last</Button>
                                                </div>
                                            )}
                                            <div className="flex justify-end mt-4 bg-transparent">
                                                <label className="text-white">Items per page:</label>
                                                <select className="ml-2 text-gray-800" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={15}>15</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    )}
                </>}

        </>
    )
}

export default Dashboard