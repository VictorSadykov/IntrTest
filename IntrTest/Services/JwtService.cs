using IntrTest.Data.Models.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IntrTest.Services
{
    public class JwtService
    {
        public const string JWT_USER_ID = "userId";
        public const string JWT_NAME = "name";
        public const string JWT_ROLE = "role";

        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<List<Claim>> GetClaimByUser(User user, UserManager<User> userManager)
        {
            var userRoles = await userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(JWT_NAME, user.UserName),
                new Claim(JWT_USER_ID, user.Id),
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(JWT_ROLE, userRole));
            }

            return authClaims;
        }

        public ClaimsPrincipal? GetClaimDataFromToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"])),
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                NameClaimType = JWT_NAME,
                RoleClaimType = JWT_ROLE
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        public JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Secret"]));

            var token = new JwtSecurityToken(
                 issuer: _config["JWT:Issuer"],
                 audience: _config["JWT:Audience"],
                 expires: DateTime.Now.Add(TimeSpan.Parse(_config["JWT:ExpiryTimeFram"])),
                 claims: authClaims,
                 signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                 );
            return token;
        }

        public string GenerateRefreshToken()
        {
            var rnd = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(rnd);
            return Convert.ToBase64String(rnd);
        }
    }
}
