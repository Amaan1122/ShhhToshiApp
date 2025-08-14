namespace ShhhToshiApp.DTOs
{
    public class WalletInfoDto
    {
        public string Address { get; set; }
        public decimal Balance { get; set; }
        public decimal StakedAmount { get; set; }
        public DateTime LastStakedAt { get; set; }
    }

}
