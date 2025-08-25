using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shhhtoshi.Api.DB;

namespace ShhhToshiApp.Controllers
{
    [ApiController]
    [Route("api/stake")]
    public class StakeUnstakeController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public StakeUnstakeController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("stake")]
        public async Task<IActionResult> Stake([FromHeader(Name = "X-Wallet-Address")] string walletAddress, [FromBody] decimal stakeAmount)
        {
            var user = await _dbContext.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null) return NotFound();
            if (user.TONBalance < stakeAmount) return BadRequest("Insufficient TON Balance");

            user.StakedAmount += stakeAmount;
            user.TONBalance -= stakeAmount;
            user.LastStakedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return Ok(new { user.StakedAmount });
        }

        [HttpPost("unstake")]
        public async Task<IActionResult> Unstake([FromHeader(Name = "X-Wallet-Address")] string walletAddress, [FromBody] decimal unStakeAmount)
        {
            var user = await _dbContext.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null) return BadRequest("Not Found");
            if (user.StakedAmount < unStakeAmount) return BadRequest("Insufficient staked balance");

            user.StakedAmount -= unStakeAmount;
            user.TONBalance += unStakeAmount;
            user.LastUnstakedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return Ok(new { user.StakedAmount });
        }

    }
}
