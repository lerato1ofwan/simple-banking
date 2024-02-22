using Microsoft.AspNetCore.Mvc;
using SimpleBanking.Api.Services.Interfaces;
using SimpleBanking.Api.Models.Dto;

namespace SimpleBanking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BankAccountController : Controller
    {
        private readonly ILogger<BankAccountController> _logger;
        private readonly IBankAccountService _bankAccountService;

        public BankAccountController(ILoggerFactory loggerFactory, IBankAccountService bankAccountService)
        {
            _logger = loggerFactory.CreateLogger<BankAccountController>();
            _bankAccountService = bankAccountService;
        }

        [HttpGet()]
        public async Task<IActionResult> GetBankAccountsAsync()
        {
            var methodName = $"{nameof(BankAccountController)}.{nameof(GetBankAccountAsync)}";
            try
            {
                var response = await _bankAccountService.GetBankAccountsAsync().ConfigureAwait(false);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to get bank account. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while getting bank account.");
            }
        }

        [HttpGet("{bankAccountId}")]
        public async Task<IActionResult> GetBankAccountAsync(Guid bankAccountId)
        {
            var methodName = $"{nameof(BankAccountController)}.{nameof(GetBankAccountAsync)}";
            try
            {
                var response = await _bankAccountService.GetBankAccountAsync(bankAccountId).ConfigureAwait(false);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to get bank account. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while getting bank account.");
            }
        }

        [HttpPost("initialize")]
        public async Task<IActionResult> InitializeBankAccountAsync(InitializeBankAccountRequest initializeBankAccountRequest)
        {
            var methodName = $"{nameof(BankAccountController)}.{nameof(InitializeBankAccountAsync)}";
            try
            {
                var response = await _bankAccountService.InitializeAccountAsync(initializeBankAccountRequest).ConfigureAwait(false);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{methodName} Failed to initialize bank account. ExceptionMessage={excetionMessage}", methodName, ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while initializing bank account.");
            }
        }
    }
}
