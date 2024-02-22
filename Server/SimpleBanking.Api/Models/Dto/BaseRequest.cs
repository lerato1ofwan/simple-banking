namespace SimpleBanking.Api.Models.Dto
{
    public class BaseRequest
    {
        public Guid AccountId { get; set; }
        public double Amount { get; set; }
        public required string TransactionReference { get; set; }
    }
}