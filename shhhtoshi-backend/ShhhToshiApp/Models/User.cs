namespace ShhhToshiApp.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<Referral> Referrals { get; set; } = new List<Referral>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Reward> Rewards { get; set; } = new List<Reward>();
    }
}
