namespace ShhhToshiApp.Models
{
    public class Referral
    {
        public Guid Id { get; set; }
        public Guid ReferrerId { get; set; }
        public Guid ReferredUserId { get; set; }
        public DateTime ReferredAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User Referrer { get; set; }
        public User ReferredUser { get; set; }
    }
}
