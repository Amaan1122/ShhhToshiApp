namespace ShhhToshiApp.Models
{
    public class WalletUser
    {
        public Guid Id { get; set; }
        public string WalletAddress { get; set; }
        public decimal StakedAmount { get; set; }
        public DateTime LastStakedAt { get; set; }
        public DateTime JoinedAt { get; set; }

    }
}
