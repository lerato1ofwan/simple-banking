using Microsoft.EntityFrameworkCore;
using SimpleBanking.Api.Models.Dto;
using SimpleBanking.Api.Models;
using SimpleBanking.Api.Services.Interfaces;
using SimpleBanking.Api.Models.Dao;
using SimpleBanking.Api.Common.Enums;

namespace SimpleBanking.Api.Services
{
    public class TransactionsService : ITransactionsService
    {
        private readonly ILogger<TransactionsService> _logger;
        private readonly SimpleBankingDbContext _dbContext;
        private readonly IBankAccountService _bankAccountService;

        public TransactionsService(ILoggerFactory loggerFactory, SimpleBankingDbContext dbContext, IBankAccountService bankAccountService)
        {
            _logger = loggerFactory.CreateLogger<TransactionsService>();
            _dbContext = dbContext;
            _bankAccountService = bankAccountService;
        }

        public async Task<Response<PaginatedResult<IEnumerable<TransactionDto>>>> GetTransactions(Guid bankAccountId, int pageNumber = 1, int pageSize = 5, CancellationToken cancellationToken = default)
        {
            var methodName = $"{nameof(TransactionsService)}.{nameof(GetTransactions)}";
            try
            {
                var transactions = await _dbContext.Transactions
                    .Where(t => t.BankAccountId == bankAccountId)
                    .OrderByDescending(t => t.CreatedDateTime)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => t.ToDto())
                    .ToListAsync(cancellationToken);

                var totalCount = await _dbContext.Transactions
                    .Where(t => t.BankAccountId == bankAccountId)
                    .CountAsync(cancellationToken);
                var paginatedResult = new PaginatedResult<IEnumerable<TransactionDto>>
                {
                    Data = (IEnumerable<TransactionDto>)transactions,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return new Response<PaginatedResult<IEnumerable<TransactionDto>>>
                {
                    Data = paginatedResult,
                    Success = true,
                    Message = "Retrieved latest transactions successfully",
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to get transactions. ExceptionMessage={exceptionMessage}", methodName, ex.Message);
                return new Response<PaginatedResult<IEnumerable<TransactionDto>>>
                {
                    Message = "An unhandled error occurred",
                    Success = false
                };
            }
        }
        public async Task<Response<AccountBalanceResponse>> DepositAsync(DepositRequest depositRequest, CancellationToken cancellationToken = default)
        {
            var methodName = $"{nameof(BankAccountService)}.{nameof(DepositAsync)}";

            try
            {
                var response = new Response<AccountBalanceResponse>();
                // Retrieve the corresponding BankAccount
                var bankAccount = await _dbContext.BankAccounts.FindAsync(depositRequest.AccountId);
                if (bankAccount == null)
                {
                    // Account not found
                    response.Success = false;
                    response.Message = "Bank account not found";
                    return response;
                }
                // Validate deposit amount
                if (depositRequest.Amount <= 0 || depositRequest.Amount > 500)
                {
                    response.Success = false;
                    response.Message = "Invalid deposit amount, " + (depositRequest.Amount > 500 ? "cannot deposit more than R500" : "cannot deposit a zero amount (R0)");
                    return response;
                }

                // Update BankAccount balance
                bankAccount.Balance += depositRequest.Amount;

                // Create a new Transaction record
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    Type = TransactionType.Deposit,
                    Amount = depositRequest.Amount,
                    CreatedDateTime = DateTime.Now,
                    BankAccountId = depositRequest.AccountId,
                    TransactionReference = string.IsNullOrWhiteSpace(depositRequest.TransactionReference) ? Guid.NewGuid().ToString() : depositRequest.TransactionReference,
                    AccountRunningBalance = bankAccount.Balance
                };

                // Add the transaction to the Transactions table
                _dbContext.Transactions.Add(transaction);

                // Save changes to the database
                await _dbContext.SaveChangesAsync(cancellationToken);

                response.Data = new AccountBalanceResponse { AccountBalance = bankAccount.Balance };
                response.Success = true;
                response.Message = "Deposit successful";
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to desposit. ExceptionMessage={exceptionMessage}", methodName, ex.Message);
                throw;
            }
        }

        public async Task<Response<AccountBalanceResponse>> WithdrawAsync(WithdrawRequest withdrawRequest, CancellationToken cancellationToken = default)
        {
            var methodName = $"{nameof(BankAccountService)}.{nameof(WithdrawAsync)}";

            try
            {
                var bankAccountResponse = await _bankAccountService.GetBankAccountAsync(withdrawRequest.AccountId).ConfigureAwait(false);
                if (!bankAccountResponse.Success)
                    return new Response<AccountBalanceResponse> { Message = "Account not found", Success = false };

                var bankAccount = bankAccountResponse.Data;

                // Validate deposit amount
                if (withdrawRequest.Amount <= 0)
                    return new Response<AccountBalanceResponse> { Message = "Cannot deposit a zero amount (R0) or less than R0", Success = false };

                if (bankAccount.Balance < withdrawRequest.Amount)
                    return new Response<AccountBalanceResponse> { Message = "Insuffient funds in account", Success = false };

                bankAccount.Balance -= withdrawRequest.Amount;
                _dbContext.BankAccounts.Update(bankAccount);

                var transaction = new Transaction
                {
                    Amount = withdrawRequest.Amount,
                    BankAccountId = withdrawRequest.AccountId,
                    CreatedDateTime = DateTime.Now,
                    Type = TransactionType.Withdrawal,
                    TransactionReference = string.IsNullOrWhiteSpace(withdrawRequest.TransactionReference) ? Guid.NewGuid().ToString() : withdrawRequest.TransactionReference,
                    AccountRunningBalance = bankAccount.Balance
                };

                await _dbContext.Transactions.AddAsync(transaction).ConfigureAwait(false);

                await _dbContext.SaveChangesAsync().ConfigureAwait(false);

                return new Response<AccountBalanceResponse>
                {
                    Data = new AccountBalanceResponse
                    {
                        AccountBalance = bankAccount.Balance
                    },
                    Message = "Withdrawal successful",
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Error, failed to desposit. ExceptionMessage={exceptionMessage}", methodName, ex.Message);
                throw;
            }
        }
    }
}