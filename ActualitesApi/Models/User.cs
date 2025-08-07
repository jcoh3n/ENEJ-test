using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ActualitesApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("nom")]
        public string Nom { get; set; } = string.Empty;

        [BsonElement("prenom")]
        public string Prenom { get; set; } = string.Empty;

        [BsonElement("profil")]
        public string Profil { get; set; } = string.Empty; // "eleve", "professeur", "direction"

        [BsonElement("login")]
        public string Login { get; set; } = string.Empty;

        [BsonElement("motDePasse")]
        public string MotDePasse { get; set; } = string.Empty;

        [BsonElement("dateCreation")]
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        [BsonElement("derniereConnexion")]
        public DateTime? DerniereConnexion { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Profil { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public DateTime? DerniereConnexion { get; set; }
    }

    public class LoginRequest
    {
        public string Login { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDto? User { get; set; }
    }
}