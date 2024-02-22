using System.ComponentModel.DataAnnotations;

namespace SimpleBanking.Api.Models.Dao
{
    public class BankAccount : BaseDao
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public double Balance { get; set; }
        public ICollection<Transaction> Transactions { get; }
    }
}