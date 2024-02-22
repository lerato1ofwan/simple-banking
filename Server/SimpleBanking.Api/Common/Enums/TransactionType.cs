using System.ComponentModel;

namespace SimpleBanking.Api.Common.Enums
{
    public enum TransactionType
    {
        [Description("Deposit")]
        Deposit,
        [Description("Withdrawal")]
        Withdrawal
    }
}