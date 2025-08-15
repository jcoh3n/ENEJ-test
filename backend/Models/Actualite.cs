using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Actualite
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("titre")]
        public string Titre { get; set; } = string.Empty;

        [BsonElement("profilsDiffusion")]
        public List<string> ProfilsDiffusion { get; set; } = new List<string>();

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("image")]
        public string? Image { get; set; }

        [BsonElement("datePublication")]
        public DateTime DatePublication { get; set; }

        [BsonElement("dateExpiration")]
        public DateTime DateExpiration { get; set; }

        [BsonElement("createurId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreateurId { get; set; } = string.Empty;

        [BsonElement("createurInfo")]
        public CreateurInfo CreateurInfo { get; set; } = new CreateurInfo();

        [BsonElement("dateCreation")]
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        [BsonElement("dateModification")]
        public DateTime? DateModification { get; set; }

        [BsonElement("actif")]
        public bool Actif { get; set; } = true;
    }

    public class CreateurInfo
    {
        [BsonElement("nom")]
        public string Nom { get; set; } = string.Empty;

        [BsonElement("prenom")]
        public string Prenom { get; set; } = string.Empty;

        [BsonElement("profil")]
        public string Profil { get; set; } = string.Empty;
    }

    public class ActualiteDto
    {
        public string Id { get; set; } = string.Empty;
        public string Titre { get; set; } = string.Empty;
        public List<string> ProfilsDiffusion { get; set; } = new List<string>();
        public string Description { get; set; } = string.Empty;
        public string? Image { get; set; }
        public DateTime DatePublication { get; set; }
        public DateTime DateExpiration { get; set; }
        public string CreateurId { get; set; } = string.Empty;
        public CreateurInfo CreateurInfo { get; set; } = new CreateurInfo();
        public DateTime DateCreation { get; set; }
        public DateTime? DateModification { get; set; }
        public bool Actif { get; set; } = true;
    }

    public class CreateActualiteRequest
    {
        public string Titre { get; set; } = string.Empty;
        public List<string> ProfilsDiffusion { get; set; } = new List<string>();
        public string Description { get; set; } = string.Empty;
        public string? Image { get; set; }
        public DateTime DatePublication { get; set; }
        public DateTime DateExpiration { get; set; }
    }

    public class UpdateActualiteRequest
    {
        public string Titre { get; set; } = string.Empty;
        public List<string> ProfilsDiffusion { get; set; } = new List<string>();
        public string Description { get; set; } = string.Empty;
        public string? Image { get; set; }
        public DateTime DatePublication { get; set; }
        public DateTime DateExpiration { get; set; }
    }
}