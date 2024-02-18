using IntrTest.Data.Models.DTO;

namespace IntrTest.Services
{
    public static class Paginator<TEntity> where TEntity: class
    {
        public static PagedDTO<TEntity> GetPaged(ICollection<TEntity> entities, int page, int pageSize)
        {
            var result = new PagedDTO<TEntity>();
            result.CurrentPage = page;
            result.PageSize = pageSize;
            result.RowCount = entities.Count();


            var pageCount = (double)result.RowCount / pageSize;
            result.PageCount = (int)Math.Ceiling(pageCount);

            var skip = (page - 1) * pageSize;
            result.Results = entities.Skip(skip).Take(pageSize).ToList();

            return result;
        }
    }
}
