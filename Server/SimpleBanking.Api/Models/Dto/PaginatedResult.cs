namespace SimpleBanking.Api.Models.Dto
{
    public class PaginatedResult<T>
    {
        public T Data { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}