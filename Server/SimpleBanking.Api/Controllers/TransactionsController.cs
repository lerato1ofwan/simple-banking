using Microsoft.AspNetCore.Mvc;
using SimpleBanking.Api.Models.Dto;
using SimpleBanking.Api.Services.Interfaces;

namespace SimpleBanking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ILogger<TransactionsController> _logger;
        private readonly ITransactionsService _transactionsService;

        public TransactionsController(ILoggerFactory loggerFactory, ITransactionsService transactionsService)
        {
            _logger = loggerFactory.CreateLogger<TransactionsController>();
            _transactionsService = transactionsService;
        }

        [HttpGet("{bankAccountId}")]
        public async Task<IActionResult> GetTransactionsHistory(Guid bankAccountId, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var methodName = $"{nameof(TransactionsController)}.{nameof(GetTransactionsHistory)}";
            try
            {
                var result = await _transactionsService.GetTransactions(bankAccountId, page, pageSize, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to get transactions history. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving transactions history.");
            }
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> DepositAsync([FromBody] DepositRequest depositRequest)
        {
            var methodName = $"{nameof(BankAccountController)}.{nameof(DepositAsync)}";
            try
            {
                var response = await _transactionsService.DepositAsync(depositRequest).ConfigureAwait(false);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to deposit. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating a deposit.");
            }
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> WithdrawAsync([FromBody] WithdrawRequest withdrawRequest)
        {
            var methodName = $"{nameof(BankAccountController)}.{nameof(DepositAsync)}";
            try
            {
                var response = await _transactionsService.WithdrawAsync(withdrawRequest).ConfigureAwait(false);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to deposit. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating a deposit.");
            }
        }
    }
}