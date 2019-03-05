using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
//using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using MySql.AspNetIdentity;

namespace PinchDB.Models
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class OAuthContext : IdentityDbContext
    {

        DbSet<User> Users { set; get; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var user = modelBuilder.Entity<IdentityUser>()
                .ToTable("Users", "dbo");
            //.Ignore(u => u.Logins)
            //.Ignore(u => u.Claims);
            modelBuilder.Entity<IdentityRole>().ToTable("Roles", "dbo");
            modelBuilder.Entity<IdentityUserRole>().ToTable("UserRoles", "dbo");
            modelBuilder.Entity<IdentityUserLogin>().ToTable("UserLogins", "dbo");
            modelBuilder.Entity<IdentityUserClaim>().ToTable("UserClaims", "dbo");
            //modelBuilder.Entity<Case>().ToTable("Cases", "dbo");

            modelBuilder.Entity<User>().Property(u => u.UserName).IsUnicode(false);
            //.HasMaxLength(100);
            modelBuilder.Entity<User>().Property(u => u.Email).IsUnicode(false);
          /*  modelBuilder.Entity<User>().Property(u => u.isActive);
            modelBuilder.Entity<User>().Property(u => u.RegisterDate);
            modelBuilder.Entity<User>().Property(u => u.Position);
            modelBuilder.Entity<User>().Property(u => u.Company);
            modelBuilder.Entity<User>().Property(u => u.Country);
            modelBuilder.Entity<User>().Property(u => u.FirstName);
            modelBuilder.Entity<User>().Property(u => u.LastName);*/

            //.HasMaxLength(100);

            modelBuilder.Entity<IdentityRole>().Property(r => r.Name).HasMaxLength(255);

            //modelBuilder.Ignore<IdentityUserLogin>();
            //modelBuilder.Ignore<IdentityUserClaim>();

            EntityTypeConfiguration<Role> entityTypeConfiguration1 = modelBuilder.Entity<Role>();
            //modelBuilder.Entity<Class>().HasKey(a => a.ID).
            entityTypeConfiguration1.Property((Role r) => r.Name).IsRequired();
        }


        public OAuthContext(): base("OAuthContext")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<OAuthContext, PinchDB.Migrations.Configuration>("OAuthContext"));

        }

        public static OAuthContext Create()
        {
            return new OAuthContext();
        }

        public static void Seed(OAuthContext context)
        {
            context.Roles.Add(new Role { Id = "1", Name = "Admin", IsDeleted = false });
            context.Roles.Add(new Role { Id = "2", Name = "Engineer", IsDeleted = false });
        }

        public class DropCreateIfChangeInitializer : DropCreateDatabaseIfModelChanges<OAuthContext>
        {
            protected override void Seed(OAuthContext context)
            {
                base.Seed(context);
            }
        }

        
        public class CreateInitializer : CreateDatabaseIfNotExists<OAuthContext>
        {
            protected override void Seed(OAuthContext context)
            {
                OAuthContext.Seed(context);

                base.Seed(context);
            }
        }

    }
}
