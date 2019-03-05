using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace API
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        //protected void Application_BeginRequest()
        //{
        //    if(Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
        //    {
        //        //
        //        Response.StatusCode = (int)HttpStatusCode.OK;
        //        Response.AppendHeader("Access-Control-Allow-Origin", Request.Headers.GetValues("Origin")[0]);
        //        Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        //        Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        //        Response.AppendHeader("Access-Control-Allow-Credentials", "true");
        //        Response.End(); Response.Flush();
        //    }
        //}
    }
}
