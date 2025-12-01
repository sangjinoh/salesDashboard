using SalesViewer.Models;
using SalesViewer.Models.Dtos;

namespace SalesViewer.Controllers.ApiControllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DaySaleDtoesController : ODataController
    {

        // GET: odata/DaySaleDtoes
        [EnableQuery(MaxOrderByNodeCount = 7, MaxNodeCount = 1000)]
        public IQueryable<DaySaleDto> GetDaySaleDtoes(DateTime startDate, DateTime endDate)
        {
            return SalesRepository.Instance.GetDaySaleDtoWithDate(startDate, endDate).AsQueryable<DaySaleDto>();
        }

    }
}
