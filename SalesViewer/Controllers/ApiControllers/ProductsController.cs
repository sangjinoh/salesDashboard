namespace SalesViewer.Controllers.ApiControllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProductsController : CriteriaApiController
    {
        public ProductsController() : base(sale => sale.product.name) { }
    }
}
