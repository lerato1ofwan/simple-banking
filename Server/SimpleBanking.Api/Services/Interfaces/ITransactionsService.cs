using SimpleBanking.Api.Models.Dto;

namespace SimpleBanking.Api.Services.Interfaces
{
    public interface ITransactionsService
    {
        public Task<Response<PaginatedResult<IEnumerable<TransactionDto>>>> GetTransactions(Guid bankAccountId, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default);
        Task<Response<AccountBalanceResponse>> WithdrawAsync(WithdrawRequest withdrawRequest, CancellationToken cancellationToken = default);
        Task<Response<AccountBalanceResponse>> DepositAsync(DepositRequest depositRequest, CancellationToken cancellationToken = default);
    }
}