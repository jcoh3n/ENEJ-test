using MongoDB.Driver;
using ActualitesApi.Data;
using ActualitesApi.Models;

namespace ActualitesApi.Services
{
    public interface IActualiteService
    {
        Task<List<Actualite>> GetActualitesForUserAsync(string userProfil, int skip = 0, int limit = 5);
        Task<Actualite?> GetActualiteByIdAsync(string id);
        Task<Actualite> CreateActualiteAsync(Actualite actualite);
        Task<Actualite?> UpdateActualiteAsync(string id, UpdateActualiteRequest request, string userId);
        Task<bool> DeleteActualiteAsync(string id, string userId);
        Task<int> GetActualitesCountForUserAsync(string userProfil);
    }

    public class ActualiteService : IActualiteService
    {
        private readonly MongoDbContext _context;

        public ActualiteService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Actualite>> GetActualitesForUserAsync(string userProfil, int skip = 0, int limit = 5)
        {
            var now = DateTime.UtcNow;
            
            return await _context.Actualites
                .Find(a => a.ProfilsDiffusion.Contains(userProfil) && 
                          a.Actif && 
                          a.DatePublication <= now && 
                          a.DateExpiration > now)
                .Sort(Builders<Actualite>.Sort.Descending(a => a.DatePublication))
                .Skip(skip)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task<Actualite?> GetActualiteByIdAsync(string id)
        {
            return await _context.Actualites
                .Find(a => a.Id == id && a.Actif)
                .FirstOrDefaultAsync();
        }

        public async Task<Actualite> CreateActualiteAsync(Actualite actualite)
        {
            actualite.DateCreation = DateTime.UtcNow;
            actualite.Actif = true;
            
            await _context.Actualites.InsertOneAsync(actualite);
            return actualite;
        }

        public async Task<Actualite?> UpdateActualiteAsync(string id, UpdateActualiteRequest request, string userId)
        {
            var filter = Builders<Actualite>.Filter.And(
                Builders<Actualite>.Filter.Eq(a => a.Id, id),
                Builders<Actualite>.Filter.Eq(a => a.Actif, true)
            );

            var actualite = await _context.Actualites.Find(filter).FirstOrDefaultAsync();
            
            if (actualite == null) return null;

            // Seul le créateur ou un profil direction peut modifier
            var user = await GetUserByIdAsync(userId);
            if (user == null || (actualite.CreateurId != userId && user.Profil != "direction"))
            {
                return null;
            }

            var update = Builders<Actualite>.Update
                .Set(a => a.Titre, request.Titre)
                .Set(a => a.ProfilsDiffusion, request.ProfilsDiffusion)
                .Set(a => a.Description, request.Description)
                .Set(a => a.Image, request.Image)
                .Set(a => a.DatePublication, request.DatePublication)
                .Set(a => a.DateExpiration, request.DateExpiration)
                .Set(a => a.DateModification, DateTime.UtcNow);

            await _context.Actualites.UpdateOneAsync(filter, update);
            
            return await GetActualiteByIdAsync(id);
        }

        public async Task<bool> DeleteActualiteAsync(string id, string userId)
        {
            var filter = Builders<Actualite>.Filter.And(
                Builders<Actualite>.Filter.Eq(a => a.Id, id),
                Builders<Actualite>.Filter.Eq(a => a.CreateurId, userId),
                Builders<Actualite>.Filter.Eq(a => a.Actif, true)
            );

            var update = Builders<Actualite>.Update
                .Set(a => a.Actif, false)
                .Set(a => a.DateModification, DateTime.UtcNow);

            var result = await _context.Actualites.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<int> GetActualitesCountForUserAsync(string userProfil)
        {
            var now = DateTime.UtcNow;
            
            return (int)await _context.Actualites
                .CountDocumentsAsync(a => a.ProfilsDiffusion.Contains(userProfil) && 
                                        a.Actif && 
                                        a.DatePublication <= now && 
                                        a.DateExpiration > now);
        }

        private async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _context.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();
        }
    }
}