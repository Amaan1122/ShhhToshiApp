namespace ShhhToshiApp.Models
{
    public class Reward
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string Source { get; set; } = string.Empty; // "Task", "Referral", "Staking"
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; }
    }
}
