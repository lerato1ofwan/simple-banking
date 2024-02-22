import React, { useState, useEffect } from 'react';
import InfoCard from './Cards/InfoCard';
import { getBankAccounts, initializeBankAccountAsync } from '../services/bankAccountService';
import { IApiResponse, IBankAccount, IInitializeBankAccountRequest, IInitializeBankAccountResponse } from '../models/interfaces';
import { Card, Input, Typography } from "@material-tailwind/react";
import Modal from './Modal';
import ClosingAlert from './Alert';
import Loader from './Loader';

interface BankAccountProps {
    setSelectedAccountId: React.Dispatch<React.SetStateAction<string>>;
    fetchTransactions: (showDialogs: boolean) => void;
}

const BankAccount: React.FC<BankAccountProps> = ({ setSelectedAccountId, fetchTransactions }) => {
    const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);
    const [selectedAccountId, setSelectedAccountIdLocal] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [bankAccountName, setBankAccountName] = useState<string>('');
    const [initialAmount, setInitialAmount] = useState<number>(0);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [cardComponent, setCardComponent] = useState<JSX.Element | null>(null);

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showAlertText, setShowAlertText] = useState<string>('');
    const [alertType, setAlertType] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response: IApiResponse = await getBankAccounts();
                if (response.success) {
                    const data = response.data as IBankAccount[];
                    if (data.length > 0) {
                        changeAccount(((data as IBankAccount[])[0] as IBankAccount).id)
                        setBankAccounts(data as IBankAccount[]);
                    }
                } else {
                    console.error(response.message ?? 'Failed to get bank account');
                    renderAlert('Failed to get bank account', "error");
                }
            } catch (error) {
                console.error('Failed to get bank account', error);
                renderAlert('Server failed to get bank accounts, unknown error, please contact server admin if problem persists', "error");
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const initializeBankAccount = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setModalTitle('Initialize new bank account')
        setCardComponent(
            <Card color="transparent" shadow={false} placeholder=''>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography placeholder='' variant="h6" color="blue-gray" className="-mb-3">
                            Bank account name
                        </Typography>
                        <Input
                            size="lg"
                            crossOrigin=''
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            placeholder='Account name'
                            onChange={(e) => setBankAccountName(e.target.value)}
                        />
                        <Typography placeholder='' variant="h6" color="blue-gray" className="-mb-3">
                            Initial amount
                        </Typography>
                        <Input
                            crossOrigin=''
                            size="lg"
                            className="p-4 !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            placeholder='R 0.00'
                            onChange={(e) => setInitialAmount(parseFloat(e.target.value))}
                        />
                    </div>
                </form>
            </Card>
        );
        setShowModal(true);

    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const accountId = e.target.value;
        changeAccount(accountId);
    };

    const changeAccount = (accountId: string) => {
        setSelectedAccountIdLocal(accountId);
        setSelectedAccountId(accountId);
        fetchTransactions(false);
    };

    const closeModal = () => {
        setInitialAmount(0);
        setBankAccountName('')
        setModalTitle('')
        setShowModal(false);
    };

    const handleInitializeBankAccount = async () => {
        try {
            if (isNaN(initialAmount)) {
                renderAlert('Amount must be a valid number', "error");
                setInitialAmount(0);
                setBankAccountName('')
                return;
            }
            if (!initialAmount || !bankAccountName) {
                const errorText = !initialAmount && !bankAccountName
                    ? "Initial Amount and Bank Account Name are required"
                    : !initialAmount
                        ? "Initial amount is required"
                        : "Bank account name is required";
                setInitialAmount(0);
                setBankAccountName('')
                renderAlert(errorText, "error");
                return;
            }

            if (initialAmount > 0) {
                var bankAccountInitializationResponse: IApiResponse = await initializeBankAccountAsync({ initialAmount, name: bankAccountName } as IInitializeBankAccountRequest);

                if (bankAccountInitializationResponse?.success) {
                    setShowModal(false);
                    renderAlert(bankAccountInitializationResponse.message, "success");

                    setInitialAmount(0);
                    setBankAccountName('');

                    const newAccountData = bankAccountInitializationResponse.data as IInitializeBankAccountResponse;
                    changeAccount(newAccountData.id)

                    const newAccount: IBankAccount = { id: newAccountData.id, balance: newAccountData.accountBalance, name: newAccountData.name, transactions: [] };
                    setBankAccounts([...bankAccounts, newAccount]);
                } else {
                    renderAlert(bankAccountInitializationResponse.message, "warning");

                    setInitialAmount(0);
                    setBankAccountName('');
                }
            }
        } catch (error) {
            console.error('Error initializing bank account', error);
            setShowModal(false);
            renderAlert('Server failed to initialize bank account, unknown error, please contact server admin if problem persists', "error");
        }
    };

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

    const closeAlert = () => {
        setShowAlertText('');
        setShowAlert(!showAlert)
    };

    const submitForm = () => {
        if (modalTitle === 'Initialize new bank account')
            handleInitializeBankAccount()

        setModalTitle('')
        setShowModal(false);
    };

    const selectedAccount = bankAccounts.find((account) => account.id === selectedAccountId);

    return (
        <div>
            {loading && <Loader />}

            <Modal show={showModal} onClose={closeModal} onSubmit={submitForm} title={modalTitle} cardComponent={cardComponent} />

            {showAlert && <ClosingAlert onClose={closeAlert} text={showAlertText} type={alertType} />}

            {!loading && !showModal && (
                <>
                    {bankAccounts.length > 0 ? (
                        <div className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4'>
                            <form className="max-w-sm outline-none">
                                <label className="sr-only">Underline select</label>
                                <select value={selectedAccountId} onChange={handleAccountChange} id="underline_select" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                    {bankAccounts.map((account) => (
                                        <option className='p-4' key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </form>
                            {selectedAccount && (
                                <InfoCard title={selectedAccount.name} value={`R ${selectedAccount.balance.toFixed(2)} (Available Balance)`}>
                                    <svg viewBox="0 0 24 24" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M20.6092 8.34165L12.0001 3.64575L3.39093 8.34165L3.75007 9.75007H5.25007V15.7501H4.50007V17.2501H19.5001V15.7501H18.7501V9.75007H20.2501L20.6092 8.34165ZM6.75007 15.7501V9.75007H9.00007V15.7501H6.75007ZM10.5001 15.7501V9.75007H13.5001V15.7501H10.5001ZM15.0001 15.7501V9.75007H17.2501V15.7501H15.0001ZM12.0001 5.35438L17.3088 8.25007H6.69131L12.0001 5.35438ZM3 19.5001H21V18.0001H3V19.5001Z" fill="#ffffff"></path> </g></svg>
                                </InfoCard>
                            )}
                            <div onClick={(e) => initializeBankAccount(e)} className='cursor-pointer flex items-center justify-center'>
                                <InfoCard title='Initialize Account' value='Create a new bank account'>
                                    <svg viewBox="0 0 42 42" width="60" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.128"></g><g id="SVGRepo_iconCarrier"> <title>plus-circle</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Icon-Set" transform="translate(-464.000000, -1087.000000)" fill="#ffffff"> <path d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z" id="plus-circle" > </path> </g> </g> </g></svg>
                                </InfoCard>
                            </div>

                        </div>
                    ) : (
                        <div onClick={(e) => initializeBankAccount(e)} className="cursor-pointer">
                            <InfoCard title='Initialize Account' value='Create a new bank account'>
                                <svg viewBox="0 0 60 60" width="60" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.128"></g><g id="SVGRepo_iconCarrier"> <title>plus-circle</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Icon-Set" transform="translate(-464.000000, -1087.000000)" fill="#ffffff"> <path d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z" id="plus-circle" > </path> </g> </g> </g></svg>

                            </InfoCard>
                        </div>
                    )}
                </>
            )}
        </div>
    );

};

export default BankAccount;