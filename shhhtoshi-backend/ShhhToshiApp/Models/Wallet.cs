namespace ShhhToshiApp.Models
{
    public class Wallet
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Address { get; set; } = string.Empty; // TON wallet address
        public decimal Balance { get; set; }
        public DateTime LinkedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; }
    }
}
