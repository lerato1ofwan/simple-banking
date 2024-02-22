using SimpleBanking.Api.Models.Dao;
using SimpleBanking.Api.Models.Dto;

namespace SimpleBanking.Api.Services.Interfaces
{
    public interface IBankAccountService
    {
        Task<Response<BankAccount>> GetBankAccountAsync(Guid bankAccountId);
        Task<Response<IEnumerable<BankAccount>>> GetBankAccountsAsync();
        Task<Response<AccountResponse>> InitializeAccountAsync(InitializeBankAccountRequest initializeBankAccountRequest);
    }
}