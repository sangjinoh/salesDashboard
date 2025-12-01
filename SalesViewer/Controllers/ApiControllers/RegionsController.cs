namespace SalesViewer.Controllers.ApiControllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RegionsController : CriteriaApiController
    {
        public RegionsController() : base(sale => sale.Region) { }
    }
}