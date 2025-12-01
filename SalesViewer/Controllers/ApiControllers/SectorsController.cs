namespace SalesViewer.Controllers.ApiControllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SectorsController : CriteriaApiController
    {
        public SectorsController() : base(sale => sale.Sector) { }
    }
}
