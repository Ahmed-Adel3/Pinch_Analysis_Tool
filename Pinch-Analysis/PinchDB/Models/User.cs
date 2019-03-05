using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PinchDB.Models
{
    public class User : IdentityUser
    {
        public String Company { set; get; }
        public String Position { set; get; }
        public String Country { set; get; }
        public String FirstName { set; get; }
        public String LastName { set; get; }
        public DateTime RegisterDate { set; get; }
        public Boolean isActive { set; get; }


        public bool IsDeleted { set; get; }
        public String EmailToken { set; get; }

        public virtual Collection<Case> Cases { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
                userIdentity.AddClaim(new Claim("isActive", this.isActive.ToString()));
                userIdentity.AddClaim(new Claim("FullName", this.FirstName+" "+this.LastName));
                userIdentity.AddClaim(new Claim("Email", this.Email));

            // Add custom user claims here
            return userIdentity;
        }
    }
}
