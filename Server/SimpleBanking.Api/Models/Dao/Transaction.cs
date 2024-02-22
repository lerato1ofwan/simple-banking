using SimpleBanking.Api.Common;
using SimpleBanking.Api.Common.Enums;
using SimpleBanking.Api.Models.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleBanking.Api.Models.Dao
{
    public class Transaction : BaseDao
    {
        [Required]
        public TransactionType Type { get; set; }
        [Required]
        public double Amount { get; set; }
        [Required]
        public DateTime CreatedDateTime { get; set; }
        [Required]
        [ForeignKey("BankAccount")]
        public Guid BankAccountId { get; set; }
        [Required]
        public required string TransactionReference { get; set; }
        public double AccountRunningBalance { get; set; }
        public BankAccount BankAccount { get; set; }

        public TransactionDto ToDto()
        {
            return new TransactionDto
            {
                TransactionReference = this.TransactionReference,
                CreatedDateTime = this.CreatedDateTime,
                Type = this.Type.GetEnumDescription(),
                Amount = (this.Type == TransactionType.Withdrawal) ? -this.Amount : this.Amount,
                AccountRunningBalance = this.AccountRunningBalance

            };
        }
    }
}