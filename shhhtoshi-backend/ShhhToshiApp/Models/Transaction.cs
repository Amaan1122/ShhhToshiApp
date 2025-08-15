namespace ShhhToshiApp.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Type { get; set; } = string.Empty; // "Stake", "Unstake", "Reward"
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; }
    }
}
