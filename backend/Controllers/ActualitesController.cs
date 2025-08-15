using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActualitesController : ControllerBase
    {
        private readonly IActualiteService _actualiteService;
        private readonly IUserService _userService;

        public ActualitesController(IActualiteService actualiteService, IUserService userService)
        {
            _actualiteService = actualiteService;
            _userService = userService;
        }

        [HttpGet("dashboard/{userId}")]
        public async Task<ActionResult<List<ActualiteDto>>> GetDashboardActualites(string userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("Utilisateur non trouvé");
                }

                var actualites = await _actualiteService.GetActualitesForUserAsync(user.Profil, 0, 5);
                
                var actualitesDto = actualites.Select(a => new ActualiteDto
                {
                    Id = a.Id,
                    Titre = a.Titre,
                    ProfilsDiffusion = a.ProfilsDiffusion,
                    Description = a.Description,
                    Image = a.Image,
                    DatePublication = a.DatePublication,
                    DateExpiration = a.DateExpiration,
                    CreateurId = a.CreateurId,
                    CreateurInfo = a.CreateurInfo,
                    DateCreation = a.DateCreation,
                    DateModification = a.DateModification,
                    Actif = a.Actif
                }).ToList();

                return Ok(actualitesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<ActualiteDto>>> GetActualitesForUser(string userId, int page = 0, int size = 5)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("Utilisateur non trouvé");
                }

                var skip = page * size;
                var actualites = await _actualiteService.GetActualitesForUserAsync(user.Profil, skip, size);
                
                var actualitesDto = actualites.Select(a => new ActualiteDto
                {
                    Id = a.Id,
                    Titre = a.Titre,
                    ProfilsDiffusion = a.ProfilsDiffusion,
                    Description = a.Description,
                    Image = a.Image,
                    DatePublication = a.DatePublication,
                    DateExpiration = a.DateExpiration,
                    CreateurId = a.CreateurId,
                    CreateurInfo = a.CreateurInfo,
                    DateCreation = a.DateCreation,
                    DateModification = a.DateModification,
                    Actif = a.Actif
                }).ToList();

                return Ok(actualitesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActualiteDto>> GetActualite(string id)
        {
            try
            {
                var actualite = await _actualiteService.GetActualiteByIdAsync(id);
                
                if (actualite == null)
                {
                    return NotFound("Actualité non trouvée");
                }

                var actualiteDto = new ActualiteDto
                {
                    Id = actualite.Id,
                    Titre = actualite.Titre,
                    ProfilsDiffusion = actualite.ProfilsDiffusion,
                    Description = actualite.Description,
                    Image = actualite.Image,
                    DatePublication = actualite.DatePublication,
                    DateExpiration = actualite.DateExpiration,
                    CreateurId = actualite.CreateurId,
                    CreateurInfo = actualite.CreateurInfo,
                    DateCreation = actualite.DateCreation,
                    DateModification = actualite.DateModification,
                    Actif = actualite.Actif
                };

                return Ok(actualiteDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ActualiteDto>> CreateActualite([FromBody] CreateActualiteRequest request, [FromQuery] string userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("Utilisateur non trouvé");
                }

                // Seuls les profils direction peuvent créer des actualités
                if (user.Profil != "direction")
                {
                    return Forbid("Seuls les profils direction peuvent créer des actualités");
                }

                var actualite = new Actualite
                {
                    Titre = request.Titre,
                    ProfilsDiffusion = request.ProfilsDiffusion,
                    Description = request.Description,
                    Image = request.Image,
                    DatePublication = request.DatePublication,
                    DateExpiration = request.DateExpiration,
                    CreateurId = user.Id,
                    CreateurInfo = new CreateurInfo
                    {
                        Nom = user.Nom,
                        Prenom = user.Prenom,
                        Profil = user.Profil
                    }
                };

                var newActualite = await _actualiteService.CreateActualiteAsync(actualite);
                
                var actualiteDto = new ActualiteDto
                {
                    Id = newActualite.Id,
                    Titre = newActualite.Titre,
                    ProfilsDiffusion = newActualite.ProfilsDiffusion,
                    Description = newActualite.Description,
                    Image = newActualite.Image,
                    DatePublication = newActualite.DatePublication,
                    DateExpiration = newActualite.DateExpiration,
                    CreateurId = newActualite.CreateurId,
                    CreateurInfo = newActualite.CreateurInfo,
                    DateCreation = newActualite.DateCreation,
                    DateModification = newActualite.DateModification,
                    Actif = newActualite.Actif
                };

                return CreatedAtAction(nameof(GetActualite), new { id = newActualite.Id }, actualiteDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ActualiteDto>> UpdateActualite(string id, [FromBody] UpdateActualiteRequest request, [FromQuery] string userId)
        {
            try
            {
                var updatedActualite = await _actualiteService.UpdateActualiteAsync(id, request, userId);
                
                if (updatedActualite == null)
                {
                    return NotFound("Actualité non trouvée ou non autorisé");
                }

                var actualiteDto = new ActualiteDto
                {
                    Id = updatedActualite.Id,
                    Titre = updatedActualite.Titre,
                    ProfilsDiffusion = updatedActualite.ProfilsDiffusion,
                    Description = updatedActualite.Description,
                    Image = updatedActualite.Image,
                    DatePublication = updatedActualite.DatePublication,
                    DateExpiration = updatedActualite.DateExpiration,
                    CreateurId = updatedActualite.CreateurId,
                    CreateurInfo = updatedActualite.CreateurInfo,
                    DateCreation = updatedActualite.DateCreation,
                    DateModification = updatedActualite.DateModification,
                    Actif = updatedActualite.Actif
                };

                return Ok(actualiteDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActualite(string id, [FromQuery] string userId)
        {
            try
            {
                var success = await _actualiteService.DeleteActualiteAsync(id, userId);
                
                if (!success)
                {
                    return NotFound("Actualité non trouvée ou non autorisé");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
    }
}