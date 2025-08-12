namespace ShhhToshiApp.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RewardAmount { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK to User who completed/assigned task
        public Guid? UserId { get; set; }
        public User? User { get; set; }
    }
}
