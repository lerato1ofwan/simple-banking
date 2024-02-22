namespace SimpleBanking.Api.Models.Dto
{
    public class InitializeBankAccountRequest
    {
        public string Name { get; set; }
        public double InitialAmount { get; set; }
    }
}