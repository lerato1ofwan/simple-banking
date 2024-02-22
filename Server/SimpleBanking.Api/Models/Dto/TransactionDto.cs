namespace SimpleBanking.Api.Models.Dto
{
    public class TransactionDto
    {
        public string TransactionReference { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Type { get; set; }
        public double Amount { get; set; }
        public double AccountRunningBalance { get; set; }
    }
}