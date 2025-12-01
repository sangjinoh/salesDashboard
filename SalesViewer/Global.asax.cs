using SalesViewer.App_Start;

namespace SalesViewer
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            FormatterConfig.RegisterFormatters(GlobalConfiguration.Configuration.Formatters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            DemoDataGenerator.Generate(HttpContext.Current.Server.MapPath("~/App_Data/SalesDashboardData.xml"));


        }
    }
}