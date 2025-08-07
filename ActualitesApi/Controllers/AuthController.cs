using Microsoft.AspNetCore.Mvc;
using ActualitesApi.Services;
using ActualitesApi.Models;

namespace ActualitesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.MotDePasse))
                {
                    return BadRequest(new LoginResponse 
                    { 
                        Success = false, 
                        Message = "Login et mot de passe requis" 
                    });
                }

                var user = await _userService.GetUserByLoginAsync(request.Login);
                
                if (user == null)
                {
                    return Unauthorized(new LoginResponse 
                    { 
                        Success = false, 
                        Message = "Login ou mot de passe incorrect" 
                    });
                }

                var isValidPassword = await _userService.ValidatePasswordAsync(request.MotDePasse, user.MotDePasse);
                
                if (!isValidPassword)
                {
                    return Unauthorized(new LoginResponse 
                    { 
                        Success = false, 
                        Message = "Login ou mot de passe incorrect" 
                    });
                }

                // Mise à jour de la dernière connexion
                await _userService.UpdateLastConnectionAsync(user.Id);

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Profil = user.Profil,
                    Login = user.Login,
                    DateCreation = user.DateCreation,
                    DerniereConnexion = DateTime.UtcNow
                };

                return Ok(new LoginResponse 
                { 
                    Success = true, 
                    Message = "Connexion réussie", 
                    User = userDto 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponse 
                { 
                    Success = false, 
                    Message = "Erreur interne du serveur" 
                });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] User user)
        {
            try
            {
                // Vérifier si l'utilisateur existe déjà
                var existingUser = await _userService.GetUserByLoginAsync(user.Login);
                if (existingUser != null)
                {
                    return BadRequest("Un utilisateur avec ce login existe déjà");
                }

                // Valider le profil
                var validProfils = new[] { "eleve", "professeur", "direction" };
                if (!validProfils.Contains(user.Profil))
                {
                    return BadRequest("Profil invalide. Valeurs acceptées: eleve, professeur, direction");
                }

                var newUser = await _userService.CreateUserAsync(user);
                
                var userDto = new UserDto
                {
                    Id = newUser.Id,
                    Nom = newUser.Nom,
                    Prenom = newUser.Prenom,
                    Profil = newUser.Profil,
                    Login = newUser.Login,
                    DateCreation = newUser.DateCreation,
                    DerniereConnexion = newUser.DerniereConnexion
                };

                return CreatedAtAction(nameof(Register), userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
    }
}