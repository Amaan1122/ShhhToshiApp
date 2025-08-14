using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shhhtoshi.Api.DB;
using ShhhToshiApp.DTOs;
using ShhhToshiApp.Models;

namespace ShhhToshiApp.Controllers
{
    [ApiController]
    [Route("api/wallet")]
    public class WalletController : ControllerBase
    {
        private readonly AppDbContext _db;

        public WalletController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("connect")]
        public async Task<IActionResult> ConnectWallet([FromHeader(Name = "X-Wallet-Address")] string walletAddress)
        {
            if (string.IsNullOrWhiteSpace(walletAddress))
                return BadRequest("Wallet address is required");

            var existing = await _db.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (existing != null)
                return Ok(new { message = "Wallet already connected" });

            var newUser = new WalletUser
            {
                Id = Guid.NewGuid(),
                WalletAddress = walletAddress,
                StakedAmount = 0,
                LastStakedAt = DateTime.UtcNow,
                JoinedAt = DateTime.UtcNow
            };

            _db.WalletUsers.Add(newUser);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Wallet connected", walletAddress });
        }

        [HttpGet("walletInfo")]
        public async Task<ActionResult<WalletInfoDto>> GetWalletInfo(string walletAddress)
        {
            var user = await _db.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null) return NotFound();

            var response = new WalletInfoDto
            {
                Address = user.WalletAddress,
                Balance = 1000m, // Replace with actual TON balance fetch
                StakedAmount = user.StakedAmount,
                LastStakedAt = user.LastStakedAt
            };

            return Ok(response);
        }

        [HttpPost("stake")]
        public async Task<IActionResult> Stake([FromHeader(Name = "X-Wallet-Address")] string walletAddress, [FromBody] decimal stakeAmount)
        {
            var user = await _db.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null) return NotFound();

            user.StakedAmount += stakeAmount;
            user.LastStakedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { user.StakedAmount });
        }

        [HttpPost("unstake")]
        public async Task<IActionResult> Unstake([FromHeader(Name = "X-Wallet-Address")] string walletAddress, [FromBody] decimal unStakeAmount)
        {
            var user = await _db.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null || user.StakedAmount < unStakeAmount) return BadRequest("Insufficient staking balance");

            user.StakedAmount -= unStakeAmount;
            await _db.SaveChangesAsync();
            return Ok(new { user.StakedAmount });
        }

        [HttpPost("claim")]
        public async Task<IActionResult> ClaimRewards([FromHeader(Name = "X-Wallet-Address")] string walletAddress)
        {
            var user = await _db.WalletUsers.FirstOrDefaultAsync(u => u.WalletAddress == walletAddress);
            if (user == null) return NotFound();

            var days = (DateTime.UtcNow - user.LastStakedAt).TotalDays;
            var reward = user.StakedAmount * 0.01m * (decimal)days;

            user.LastStakedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { reward });
        }
    }
}
