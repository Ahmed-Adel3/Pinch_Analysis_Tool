using API.Repositories;
using MySql.AspNet.Identity;
using PinchDB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace API.Controllers
{
    [System.Web.Http.Authorize(Roles = "Admin")]
    [RoutePrefix("api/AdminPanel")]
    public class AdminPanelController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        string BlockingEnabled = WebConfigurationManager.AppSettings["UserBlockingCheck"];


        #region Blocking and Activating
        [Route("BlockUser")]
        [HttpPost]
        public IHttpActionResult BlockUser(string Id)
        {
          /*  if (BlockingEnabled == "true")
            {*/
                var user = unitOfWork.GetRepoInstance<User>().GetBy(a => a.Id == Id).FirstOrDefault();
                user.isActive = false;
             /*   BlocklManager.Instance.concurrent.TryAdd(user.UserName,user);*/
                unitOfWork.SaveChanges();
                return Ok("UserBlocked");
          /*  } else
            {
                return Ok("BlockingDisabled");
            }*/
        }

        [Route("ActivateUser")]
        [HttpPost]
        public IHttpActionResult ActivateUser(string Id)
        {
           /* if (BlockingEnabled == "true")
            {*/
                var user = unitOfWork.GetRepoInstance<User>().GetBy(a => a.Id == Id).FirstOrDefault();
                user.isActive = true;
            /*    BlocklManager.Instance.concurrent.TryRemove(user.UserName, out user);*/
                unitOfWork.SaveChanges();
                return Ok("UserActivated");
          /* } else
            {
                return Ok("BlockingDisabled");
            }*/
        }
        #endregion


        #region Statistics Page
        [Route("GetStatistics")]
        [HttpGet]
        public IHttpActionResult GetStatistics()
        {
            var Users = unitOfWork.GetRepoInstance<User>().GetAll();
            int NewUsersToday = Users.Where(a => a.RegisterDate <= DateTime.Now && a.RegisterDate >= DateTime.Now.AddDays(-1)).Count();
            int NewUsersWeek = Users.Where(a => a.RegisterDate <= DateTime.Now && a.RegisterDate >= DateTime.Now.AddDays(-7)).Count();
            int NewUsersMonth = Users.Where(a => a.RegisterDate <= DateTime.Now && a.RegisterDate >= DateTime.Now.AddMonths(-1)).Count();

            var Roles = unitOfWork.GetRepoInstance<Role>().GetAll();
            int AllUsersCount = Users.Count();
            int AdminCount = Roles.Where(a => a.Name == "Admin").FirstOrDefault().Users.Count();
            int FreeUsersCount = Roles.Where(a => a.Name == "FreeUser").FirstOrDefault().Users.Count();
            int PremiumUsersCount = Roles.Where(a => a.Name == "PremiumUser").FirstOrDefault().Users.Count();

            var Cases = unitOfWork.GetRepoInstance<Case>().GetAll();
            int CasesCount = Cases.Count();
            int NewCasesToday = Cases.Where(a => a.Date <= DateTime.Now && a.Date >= DateTime.Now.AddDays(-1)).Count();
            int NewCasesWeek = Cases.Where(a => a.Date <= DateTime.Now && a.Date >= DateTime.Now.AddDays(-7)).Count();
            int NewCasesMonth = Cases.Where(a => a.Date <= DateTime.Now && a.Date >= DateTime.Now.AddMonths(-1)).Count();

            int AvgCasesPerUser =(int) Math.Ceiling((double)CasesCount / (double)AllUsersCount) ;

            var UsersWithMostCasesSaved = Users.OrderByDescending(a => a.Cases.Count()).Take(3).Select(a=> 
            new { FullName=a.FirstName+" "+a.LastName,
                  UserName=a.UserName,
                  Email=a.Email,
                  NumberOfCases=a.Cases.Count()
                           });

            return Ok(
                    new {
                        AllUsersCount= AllUsersCount,
                        NewUsersToday =NewUsersToday,
                        NewUsersWeek = NewUsersWeek,
                        NewUsersMonth= NewUsersMonth,
                        NewCasesToday = NewCasesToday,
                        NewCasesWeek = NewCasesWeek,
                        NewCasesMonth = NewUsersMonth,
                        adminCount = AdminCount,
                        FreeUsersCount = FreeUsersCount,
                        PremiumUsersCount = PremiumUsersCount,
                        AvgCasesPerUser = AvgCasesPerUser,
                        CasesCount=CasesCount,
                        UsersWithMostCasesSaved = UsersWithMostCasesSaved
                    }
                );
        }
        #endregion


        #region Users 
        [Route("GetAllUsers")]
        [HttpGet]
        public IHttpActionResult GetAllUsers()
        {
            var Users = unitOfWork.GetRepoInstance<User>().GetAll();
            var Roles = unitOfWork.GetRepoInstance<Role>().GetAll();


            var UsersMapped = Users.Select(a =>
            new {
                UserId=a.Id,
                FullName = a.FirstName + " " + a.LastName,
                isActive = a.isActive,
                RegisterDate = a.RegisterDate.ToShortDateString() ,
                Email = a.Email,
                NumberOfCases = a.Cases.Count(),
                Position = a.Position+" at "+a.Company,
                Country = a.Country,
                Role=Roles.Where(r=>r.Id == a.Roles.FirstOrDefault().RoleId).FirstOrDefault().Name
            }).ToList();
            return Ok(UsersMapped);
        }
        #endregion

        #region Cases
        [Route("GetAllCases")]
        [HttpGet]
        public IHttpActionResult GetAllCases()
        {
            var Cases = unitOfWork.GetRepoInstance<Case>().GetAll();

            var CasesMapped = Cases.Select(a =>
            new {
                CaseId=a.Id,
                CaseName = a.CaseName,
                CaseDescription = a.CaseDescription,
                CaseData = a.CaseInput,
                User = a.user.FirstName+" "+a.user.LastName,
                CaseDate = a.Date.ToShortDateString(),
                isDeleted= a.isDeleted
            });
            return Ok(CasesMapped);
        }

        [Route("RemoveCase")]
        [HttpPost]
        public IHttpActionResult RemoveCase(string Id)
        {
            int id;
            int.TryParse(Id, out id);
            var Case = unitOfWork.GetRepoInstance<Case>().GetBy(a=>a.Id == id).FirstOrDefault();
            unitOfWork.GetRepoInstance<Case>().Delete(Case);
            unitOfWork.SaveChanges();
            return Ok("CaseRemoved");
        }
        #endregion
    }
}