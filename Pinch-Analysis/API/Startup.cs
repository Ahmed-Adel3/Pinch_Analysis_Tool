using API.Repositories;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
//using MySql.AspNet.Identity;
using Owin;
using PinchDB.Models;
using System.Web.Http;

[assembly: OwinStartup(typeof(API.Startup))]

namespace API
{
    public partial class Startup
    {
        OwinContext repo = new OwinContext();

        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            ConfigureAuth(app);
            //CreateRoles();
            HttpConfiguration config = new HttpConfiguration();
            
            WebApiConfig.Register(config);
    
            app.UseWebApi(config);
     

        }

        //public void CreateRoles()
        //{

        //    //var roleManager = new MySqlRoleStore<IdentityRole>();
        //    var roleManager = new RoleManager<Role>(new RoleStore<Role>(new OAuthContext()));
        //    Role role;

        //    if (!roleManager.RoleExists("Admin"))
        //    {
        //        role = new Role();
        //        role.Name = "Admin";
        //        roleManager.CreateAsync(role);
        //    }
        //    if (!roleManager.RoleExists("FreeUser"))
        //    {
        //        role = new Role();
        //        role.Name = "FreeUser";
        //        roleManager.CreateAsync(role);
        //    }
        //    if (!roleManager.RoleExists("PremiumUser"))
        //    {
        //        role = new Role();
        //        role.Name = "PremiumUser";
        //        roleManager.CreateAsync(role);
        //    }

        //}
    }
}
