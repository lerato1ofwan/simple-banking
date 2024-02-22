using Microsoft.EntityFrameworkCore;
using SimpleBanking.Api.Common.Enums;
using SimpleBanking.Api.Models;
using SimpleBanking.Api.Models.Dao;
using SimpleBanking.Api.Models.Dto;
using SimpleBanking.Api.Services.Interfaces;

namespace SimpleBanking.Api.Services
{
    public class BankAccountService : IBankAccountService
    {
        private readonly ILogger<BankAccountService> _logger;
        private readonly SimpleBankingDbContext _dbContext;

        public BankAccountService(ILoggerFactory loggerFactory, SimpleBankingDbContext dbContext)
        {
            _logger = loggerFactory.CreateLogger<BankAccountService>();
            _dbContext = dbContext;
        }

        public async Task<Response<AccountResponse>> InitializeAccountAsync(InitializeBankAccountRequest initializeBankAccountRequest)
        {
            var methodName = $"{nameof(BankAccountService)}.{nameof(InitializeAccountAsync)}";

            try
            {
                if (initializeBankAccountRequest.InitialAmount > 500)
                {
                    return new Response<AccountResponse>
                    {
                        Success = false,
                        Message = "Invalid initialization amount to deposit, cannot deposit more than R500"
                    };
                }

                var newAccount = new BankAccount
                {
                    Balance = initializeBankAccountRequest.InitialAmount,
                    Name = initializeBankAccountRequest.Name
                };
                await _dbContext.BankAccounts.AddAsync(newAccount).ConfigureAwait(false);

                if (initializeBankAccountRequest.InitialAmount >  0)
                {

                    var transaction = new Transaction
                    {
                        Amount = initializeBankAccountRequest.InitialAmount,
                        AccountRunningBalance = initializeBankAccountRequest.InitialAmount,
                        BankAccountId = newAccount.Id,
                        CreatedDateTime = DateTime.Now,
                        Type = TransactionType.Deposit,
                        TransactionReference = "Account Initialization"
                    };
                    await _dbContext.Transactions.AddAsync(transaction).ConfigureAwait(false);
                }

                await _dbContext.SaveChangesAsync().ConfigureAwait(false);

                return new Response<AccountResponse> { Data = new AccountResponse { Id = newAccount.Id, AccountBalance = newAccount.Balance, Name = newAccount.Name }, Message = "Bank account initialized successfully", Success = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to initlialize bank account. ExceptionMessage={exceptionMessage}", methodName, ex.Message);
                return new Response<AccountResponse>
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }

        public async Task<Response<BankAccount>> GetBankAccountAsync(Guid bankAccountId)
        {
            var methodName = $"{nameof(BankAccountService)}.{nameof(GetBankAccountAsync)}";

            try
            {
                var bankAccount = await _dbContext.BankAccounts.Include(x => x.Transactions).FirstOrDefaultAsync(x => x.Id == bankAccountId).ConfigureAwait(false);
                return new Response<BankAccount>
                {
                    Data = bankAccount,
                    Success = true,
                    Message = bankAccount != default ? "Account retrieved successfully" : "Account not found"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to get bank account id={bankAccountId}. ExceptionMessage={exceptionMessage}", methodName, bankAccountId, ex.Message);
                return new Response<BankAccount>
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }

        public async Task<Response<IEnumerable<BankAccount>>> GetBankAccountsAsync()
        {
            var methodName = $"{nameof(BankAccountService)}.{nameof(GetBankAccountsAsync)}";

            try
            {
                var bankAccounts = await _dbContext.BankAccounts.ToListAsync().ConfigureAwait(false);
                return new Response<IEnumerable<BankAccount>>
                {
                    Data = bankAccounts,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to get bank accounts. ExceptionMessage={exceptionMessage}", methodName, ex.Message);
                return new Response<IEnumerable<BankAccount>>
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }
    }
}