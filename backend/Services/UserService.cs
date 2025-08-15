using MongoDB.Driver;
using backend.Data;
using backend.Models;
using BCrypt.Net;

namespace backend.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByLoginAsync(string login);
        Task<User?> GetUserByIdAsync(string id);
        Task<User> CreateUserAsync(User user);
        Task<bool> ValidatePasswordAsync(string password, string hashedPassword);
        Task UpdateLastConnectionAsync(string userId);
    }

    public class UserService : IUserService
    {
        private readonly MongoDbContext _context;

        public UserService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByLoginAsync(string login)
        {
            return await _context.Users
                .Find(u => u.Login == login)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _context.Users
                .Find(u => u.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            // Hash du mot de passe avant sauvegarde
            user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(user.MotDePasse);
            user.DateCreation = DateTime.UtcNow;
            
            await _context.Users.InsertOneAsync(user);
            return user;
        }

        public async Task<bool> ValidatePasswordAsync(string password, string hashedPassword)
        {
            return await Task.FromResult(BCrypt.Net.BCrypt.Verify(password, hashedPassword));
        }

        public async Task UpdateLastConnectionAsync(string userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Set(u => u.DerniereConnexion, DateTime.UtcNow);
            
            await _context.Users.UpdateOneAsync(filter, update);
        }
    }
}