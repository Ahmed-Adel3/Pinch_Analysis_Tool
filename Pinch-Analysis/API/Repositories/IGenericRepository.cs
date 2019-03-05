using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> GetALLByPage(int pageNumber, int pageSize);
        IEnumerable<TEntity> GetBy(Expression<Func<TEntity, bool>> filter = null);

        TEntity Add(TEntity entity);

        TEntity Edit(TEntity entity);

        TEntity Delete(TEntity entity);
    }
}