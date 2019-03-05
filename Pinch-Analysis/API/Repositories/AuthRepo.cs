using API.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PinchDB.Models;
using System;
using System.Threading.Tasks;
using System.Web;
using System.Linq;
using Microsoft.AspNet.Identity.Owin;

namespace API.Repositories
{
    public class AuthRepo : IDisposable
    {
        private OAuthContext authContext;
        private ApplicationUserManager userManager;
        private UnitOfWork unitOfWork = new UnitOfWork();
        public AuthRepo()
        {
            authContext = new OAuthContext();
            //please don't omit System.Web. part
            userManager = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
        }

        public async Task<IdentityResult> RegisterUser(RegisterModel userModel)
        {
            User user = new User
            {
                UserName = userModel.UserName,
                Email = userModel.Email,
                Company = userModel.Company,
                Position = userModel.Position,
                Country = userModel.Country,
                FirstName = userModel.FirstName,
                LastName = userModel.LastName,
                IsDeleted = false,
                EmailConfirmed = false,
                EmailToken = userModel.EmailToken,
                isActive = true,
                RegisterDate = DateTime.Now
            };

            var result = await userManager.CreateAsync(user, userModel.Password);
            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            return await userManager.FindAsync(userName, password);
        }

        public async Task<IdentityUser> FindUserByNameOrEmail(string NameOrEmail, string password)
        {
            if (NameOrEmail.Contains("@"))
            {
                return await userManager.FindByEmailAsync(NameOrEmail);
            }
            else return await userManager.FindAsync(NameOrEmail, password);
        }

        public async Task<IdentityResult> ChangePassword(string currentPass , string newPass)
        {
            String id = HttpContext.Current.User.Identity.GetUserId();
            
            return await userManager.ChangePasswordAsync(HttpContext.Current.User.Identity.GetUserId(), currentPass,newPass);
        }

        public async Task<IdentityResult> ResetPassword(string token ,string userEmail, string newPass)
        {
            GenericRepository<User> userRepo = unitOfWork.GetRepoInstance<User>();
            User user = userRepo.GetBy(u => u.Email.Equals(userEmail)).FirstOrDefault();
            
            return await userManager.ResetPasswordAsync(user.Id ,token , newPass);
        }

        public async Task<string> GenerateResetPasswordToken(string userId)
        {
            string code = await userManager.GeneratePasswordResetTokenAsync(userId);
            return code;
        }

        public bool ConfirmEmail(string emailToken)
        {
            GenericRepository<User> userRepo = unitOfWork.GetRepoInstance<User>();
            User user = userRepo.GetBy(u => u.EmailToken.Equals(emailToken)).FirstOrDefault();
            if (user != null)
            {
                user.EmailConfirmed = true;
                try
                {
                    userRepo.Edit(user);
                    unitOfWork.SaveChanges();
                    return true;
                }
                catch (Exception e)
                {
                    return false;
                }
            }
            return false;
        }

        public void Dispose()
        {
            authContext.Dispose();
            userManager.Dispose();
        }
    }
}