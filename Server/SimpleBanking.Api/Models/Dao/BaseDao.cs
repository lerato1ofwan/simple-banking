using System.ComponentModel.DataAnnotations;

namespace SimpleBanking.Api.Models.Dao
{
    public class BaseDao
    {
        [Key]
        public Guid Id { get; set; }
    }
}
