using System;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security.OAuth;
using API.Providers;
using PinchDB.Models;
using API.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.Cookies;
using System.Threading.Tasks;
using Microsoft.Owin.Security.Infrastructure;

[assembly: OwinStartup(typeof(API.Startup))]

namespace API
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        public static string PublicClientId { get; private set; }

        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            PublicClientId = "self";
            app.CreatePerOwinContext(OAuthContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            OAuthProvider OaProvider = new OAuthProvider(PublicClientId);

      /*      OaProvider.OnValidateClientRedirectUri = (context) =>
            {
                return Task.Run(() =>
                {
                    //Caution: this is not to validate that the uri is valid syntax wise, this is to validate it business wise. If this uri is not
                    //valid syntax wise this entry will not be hit in the first place, and your authentication process will not work!
                    context.Validated();
                });
            };

            OaProvider.OnValidateAuthorizeRequest = (context) =>
            {
                return Task.Run(() =>
                {
                    //Authorization validation here
                    //Somewhere in the request you should create the identity and sign in with it, I put it here, it could be a page on your app?
                    context.OwinContext.Authentication.SignIn(new System.Security.Claims.ClaimsIdentity("Bearer"));
                    context.Validated();
                });
            };

            OaProvider.OnAuthorizeEndpoint = (context) =>
            {
                return Task.Run(() =>
                {
                    //This is the last chance to alter the request, you can either end it here using RequestCompleted and start resonding, 
                    //or you can let it go through to the subsequent middleware, 
                    //except that you have to make sure the response returns a 200, otherwise the whole thing will not work
                    context.RequestCompleted();
                    var str = context.Options.AccessTokenFormat;

                });
            };


            OaProvider.OnValidateClientAuthentication = (context) =>
            {
                return Task.Run(() =>
                {
                    //Client validation here
                    context.Validated();
                });
            };


            AuthenticationTokenProvider authTokenProvider = new AuthenticationTokenProvider();
            authTokenProvider.OnCreate = (context) =>
            {
                //create a dummy token 
                context.SetToken("DummyToken");
            };

            authTokenProvider.OnReceive = (context) =>
            {
                //create dummy identity regardless of the validty of the token :)
                var claimsIdentity = new System.Security.Claims.ClaimsIdentity("Bearer");

                context.SetTicket(new Microsoft.Owin.Security.AuthenticationTicket(claimsIdentity,
                    new Microsoft.Owin.Security.AuthenticationProperties
                    {
                        
                        ExpiresUtc = new System.DateTimeOffset(2015, 3, 1, 1, 1, 1, new System.TimeSpan(5,0,0)),
                    }
                    ));
            };*/
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/token"),
                Provider = OaProvider,
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(3),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };
            // Enable the application to use bearer tokens to authenticate users


          /*  OAuthOptions.AuthorizationCodeProvider = authTokenProvider;
            OAuthOptions.RefreshTokenProvider = authTokenProvider;
            OAuthOptions.AccessTokenProvider = authTokenProvider;*/

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            app.UseOAuthAuthorizationServer(OAuthOptions);
           /* app.UseOAuthBearerTokens(OAuthOptions);*/

        }
    }
}
