using System;
using System.Linq;
using PinchDB.Models;
using System.Data.Entity.Infrastructure;

namespace API.Repositories
{
    public class UnitOfWork
    {
        private OAuthContext dbContext;
        public Type TheType { get; set; }

        public UnitOfWork(OAuthContext context)
        {
            dbContext = context;
        }

        public UnitOfWork()
        {
            dbContext = new OAuthContext();
        }

        public GenericRepository<TEntityType> GetRepoInstance<TEntityType>() where TEntityType : class
        {
            return new GenericRepository<TEntityType>(dbContext);
        }

        public void SaveChanges()
        {
            bool saveFailed;
            do
            {
                saveFailed = false;

                try
                {
                    this.dbContext.SaveChanges();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    saveFailed = true;

                    // Update the values of the entity that failed to save from the store 
                    ex.Entries.Single().Reload();
                }

            } while (saveFailed);
        }
    }
}