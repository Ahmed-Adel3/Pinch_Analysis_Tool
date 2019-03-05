using API.Models;
using API.Repositories;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using PinchDB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace API.Controllers
{
    [Authorize]
    [RoutePrefix("api/Profile")]
    public class ProfileController : ApiController
    {
        UnitOfWork unitOfWork; 
        GenericRepository<User> userRepo;
        private ApplicationUserManager _userManager;

        public ProfileController()
        {
            unitOfWork = new UnitOfWork();
            userRepo = unitOfWork.GetRepoInstance<User>();
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [Authorize]
        [Route("MenuData")]
        [HttpGet]
        public IHttpActionResult MenuData()
        {
            return Ok(new
            {
                UserName = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(a => a.Type == "FullName").Value,
                Email = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(a => a.Type == "Email").Value,
                Role = User.IsInRole("Admin")
            });
        }

        [Authorize]
        [Route("ProfileData")]
        [HttpGet]
        public IHttpActionResult ProfileData()
        {
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();
            return Ok(new
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Company = user.Company,
                Country  = user.Country,
                Position = user.Position,
            });
        }

        [Authorize]
        [Route("EditProfile")]
        [HttpPost]
        public IHttpActionResult EditProfile(EditProfileModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Country = model.Country;
            user.Position = model.Position;
            user.Company = model.Company;
            userRepo.Edit(user);
            unitOfWork.SaveChanges();
            return Ok("Edited Successfully");
        }

        [Authorize]
        [Route("ResetPassword")]
        [HttpPost]
        public async Task<IHttpActionResult> ResetPassword(ChangePasswordModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
               model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok("Password Changed Successfully");
        }


        [Authorize]
        [Route("SaveCase")]
        [HttpPost]
        public IHttpActionResult SaveCase( CaseModel UserCase )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();

            var newCase = new Case
            {
                UserId = user.Id,
                CaseInput = UserCase.CaseInputs,
                CaseName = UserCase.CaseName,
                CaseDescription = UserCase.CaseDescription
            };
            user.Cases.Add(newCase);

            userRepo.Edit(user);
            unitOfWork.SaveChanges();
            return Ok(newCase.Id);
        }

        [Authorize]
        [Route("GetCases")]
        [HttpGet]
        public IHttpActionResult GetCases()
        {
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();
             var cases = user.Cases.Where(a=>a.isDeleted == false).Select(a=> {
                 return new
                 {
                     id = a.Id,
                     caseInput = a.CaseInput,
                     userId = a.UserId,
                     caseDescription = a.CaseDescription,
                     caseName = a.CaseName,
                     caseDate = a.Date.Day+"/"+a.Date.Month+"/"+a.Date.Year+" ( "+a.Date.Hour+":"+a.Date.Minute+" )"
                 };
             }) ;

            return Ok(cases);
        }

        [Authorize]
        [Route("DeleteCase")]
        [HttpGet]
        public IHttpActionResult DeleteCase(int id)
        {
            var thisCase = unitOfWork.GetRepoInstance<Case>().GetBy(a => a.Id == id).FirstOrDefault();
            thisCase.isDeleted = true;
            unitOfWork.SaveChanges();

            return Ok("Case Deleted Successfully");
        }

        [Authorize]
        [Route("SaveChartComment")]
        [HttpPost]
        public IHttpActionResult SaveChartComment(SaveChartCommentModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = userRepo.GetBy(a => a.UserName == User.Identity.Name).FirstOrDefault();
            var CurrentCase= user.Cases.Where(a => a.Id == model.CaseId).FirstOrDefault();
            
            switch(model.Chart)
            {
                case "TH":
                    CurrentCase.HT_Comment = model.Comment;
                    break;
                case "GCC":
                    CurrentCase.GCC_Comment = model.Comment;
                    break;
                case "Grid":
                    CurrentCase.Grid_Comment = model.Comment;
                    break;
            }
            userRepo.Edit(user);
            unitOfWork.SaveChanges();

            return Ok(model.Chart+" Comment Edited Successfully");
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        [Authorize]
        [Route("KeepAlive")]
        [HttpGet]
        public IHttpActionResult KeepAlive()
        {
            return Ok();
        }

    }
}