namespace SimpleBanking.Api.Models.Dto
{
    public class Response<T> : BaseResponse
    {
        public T Data { get; set; }
    }

    public class BaseResponse
    {
        public string? Message { get; set; }
        public bool Success { get; set; }
    }

    public class AccountBalanceResponse { public double AccountBalance { get; set; } }
    public class AccountResponse : AccountBalanceResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}