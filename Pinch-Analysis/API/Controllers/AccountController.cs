using API.Models;
using API.Repositories;
using Microsoft.AspNet.Identity;
using System.Web.Hosting;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using PinchDB.Models;
using System.Configuration;
using GAPTechAPI.Mailing;
using API.TokenGenerator;
using System.Web;
using System.IO;
using System.Net.Http;
using System.Net;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.AspNet.Identity.Owin;
using API.Results;
using System.Security.Claims;
using System.Collections.Generic;
using System.Security.Cryptography;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using Newtonsoft.Json;
using API.Utils;
using System.Collections.Concurrent;
using System.Web.Configuration;
using System.Web.Security;

namespace API.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        //linkedin Parameters
        private const string LinkedinUserInfoParameters = "id,first-name,last-name,maiden-name,formatted-name,phonetic-first-name,phonetic-last-name,formatted-phonetic-name,headline,location,picture-url,industry,current-share,num-connections,num-connections-capped,summary,specialties,positions,picture-urls,site-standard-profile-request,api-standard-profile-request,public-profile-url,email-address,languages,skills";


        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // TODO : change the email used for sedning mails to Gaptech info mail or any other mail
        // TODO : Test ChangePass 
        // TODO : Complete forgetPass 
        #region Properities
        //schema + authority only
        private static readonly string BASE_URL = AccountController.GetBaseUrl();
        // path segments
        private static readonly string CONFIRM_EMAIL_PATH = "api/account/confirmemail";

        private static readonly string SUCCESS_REDIRECT = GlobalSettings.GetUrl()+"pinchV1/byStream";

        private static readonly string FAIL_REDIRECT = "http://pinch.gaptech.co/mailTemplate/Error/error.html ";

        private static readonly string RESET_PASSWORD_PATH = GlobalSettings.GetUrl()+"reset-password/";

        OAuthContext db = new OAuthContext();

        UnitOfWork unitOfWork = new UnitOfWork();

        #endregion


        #region AccountEndPoints

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        //Tested cnd Complete
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var repository = new AuthRepo())
            {
                string token = Cryptography.GetRandomKey(64);
                model.EmailToken = token;
                User user = new User()
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    Company = model.Company,
                    Position = model.Position,
                    Country = model.Country,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    IsDeleted = false,
                    EmailConfirmed = false,
                    EmailToken = model.EmailToken,
                    isActive = true,
                    RegisterDate = DateTime.Now
                };
                IdentityResult result = await UserManager.CreateAsync(user , model.Password);
                if (!result.Succeeded)
                {
                    return GetErrorResult(result);
                }
                try
                {
                    UserManager.AddToRole(user.Id, "FreeUser");
                } catch ( Exception e)
                {
                    var a = e.Message;
                    IdentityResult newRes = new IdentityResult("Something wrong happened,Please retry");
                    return GetErrorResult(newRes);
                }

                string url = GenerateURL(token , CONFIRM_EMAIL_PATH,1);

                // Send Mail
                string SenderEmail = ConfigurationManager.AppSettings.Get("Email");
                string SenderPassword = ConfigurationManager.AppSettings.Get("Password");
                string SmtpHost = ConfigurationManager.AppSettings.Get("SmtpHost"); ;
                int SmtpPort = Convert.ToInt16(ConfigurationManager.AppSettings.Get("SmtpPort"));
                bool SmtpEnableSSL = Convert.ToBoolean(ConfigurationManager.AppSettings.Get("SmtpEnableSSL"));
                string Subject = "Enpire Account Created Successfully";
                string line1 = "Thank you for signing up in Gap-Tech Pinch Analysis Tool";
                string line2 = "Please follow the link beow to activate your account!";
                string btnText = "Activate Account";
                string Body = GenerateEmailFromTemnplate(user.UserName, url, line1, line2, btnText);
                MailConfiguration mailConfiguration = new MailConfiguration(SenderEmail, "Enpire Team", SenderPassword)
                {
                    Host = SmtpHost,
                    Port = SmtpPort,
                    EnableSsl = SmtpEnableSSL
                };
                Email uEmail = new Email(mailConfiguration);
                uEmail.Send(model.Email, Subject, Body);
                return Ok();
            }
        }

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model, string token)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GenericRepository<User> userRepo = unitOfWork.GetRepoInstance<User>();
            var Users = userRepo.GetBy(u => u.Email == model.Email);
            if (Users.Count() > 0)
             {
                string UserMail = Users.FirstOrDefault().Email;
                  return Redirect(GlobalSettings.GetUrl() + "Linkedin_Error/"+ UserMail);
                //  return await GetExternalLogin("Linkedin");
            }

            // ExternalLoginInfo info = await Authentication.GetExternalLoginInfoAsync();

            /*    if (info == null)  return InternalServerError();*/

            var user = new User() {
                UserName = model.UserName,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                Company = model.Company,
                Position = model.Position,
                Country = model.Country,
                IsDeleted = false,
                EmailConfirmed = true,
                RegisterDate = DateTime.Now,
                isActive = true
            };

            IdentityResult result = await UserManager.CreateAsync(user);
            await UserManager.AddToRoleAsync(user.Id, "FreeUser");
            var info = new ExternalLoginInfo()
            {
                DefaultUserName = model.UserName,
                Login = new UserLoginInfo("Linkedin", user.Id)
            };
            result = await UserManager.AddLoginAsync(user.Id, info.Login);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            /*   if (!result.Succeeded)
               {
                   return GetErrorResult(result);
               }*/
           return Redirect(GlobalSettings.GetUrl()+"set-password/"+user.Id);
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
            };
        }


        private string GetQueryString(HttpRequestMessage request, string key)
        {
            var queryStrings = request.GetQueryNameValuePairs();

            if (queryStrings == null) return null;

            var match = queryStrings.FirstOrDefault(keyValue => string.Compare(keyValue.Key, key, true) == 0);

            if (string.IsNullOrEmpty(match.Value)) return null;

            return match.Value;
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            User user = UserManager.FindById(model.Id);

            if (user == null || user.PasswordHash != null )
            {
                return BadRequest("This request is invalid");
            }

            IdentityResult result = await UserManager.AddPasswordAsync(model.Id, model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }


        [AllowAnonymous]
        [Route("Verify")]
        [HttpGet]
        public IHttpActionResult Verify()
        {
            if (User.Identity.IsAuthenticated) { return Ok("Authorized"); }
            else return Ok("Not Authorized");

        }

        [Authorize]
        [Route("AccountData")]
        [HttpGet]
        public IHttpActionResult AccountData()
        {
            return Ok(new {
                UserName = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(a => a.Type == "FullName").Value,
                Email = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(a => a.Type == "Email").Value,
                Role = User.IsInRole("Admin")
            } );
        }
        
        //Tested and Compltete
        /// <summary>
        /// Just click the link
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("ConfirmEmail")]
        [AllowAnonymous]
        public HttpResponseMessage ConfirmEmail(string token) {
            var response = Request.CreateResponse();
            response.StatusCode = HttpStatusCode.Moved;
            using (var repository = new AuthRepo())
            {
                bool result = repository.ConfirmEmail(token);
                switch (result) {
                    case true:
                        response.Headers.Location = new Uri(SUCCESS_REDIRECT);
                        return response;

                    case false:
                        response.Headers.Location = new Uri(FAIL_REDIRECT);
                        return response;
                }
            }
            response.Headers.Location = new Uri(FAIL_REDIRECT);
            return response;
        }


        /// <summary>
        /// url /api/account/changepassword
        /// Mime type application/json
        /// example:
        /// {
        /// "OldPassword":"oldPass", "NewPassword":"newPass", "ConfirmPassword":"newPassConfirm"
        /// }
        /// must use Authorization: Bearer in the headers
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>

        // POST api/Account/ChangePassword
        [Authorize]
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        
        //Tested and Complete
        /// <summary>
        /// Takes User Email , Checks if its available and then send email with unique url to the user
        /// </summary>
        /// <param name="userEmail">The user Email</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("ForgetPassword")]
        public async Task<IHttpActionResult> SendResetPasswordEmail(ForgetPasswordMailModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                GenericRepository<User> userRepo = unitOfWork.GetRepoInstance<User>();
                User user = userRepo.GetBy(u => u.Email.Equals(model.Email)).FirstOrDefault();
                if (null != user)
                {
                    // I must send a url with a form to reset the password 
                    // I must get the token back with the email , password and confirm password
                    string originalToken = "";
                    string token = "";
                    using (AuthRepo respository = new AuthRepo())
                    {
                        originalToken = await respository.GenerateResetPasswordToken(user.Id);
                        byte[] byt = System.Text.Encoding.UTF8.GetBytes(originalToken);
                        token = Convert.ToBase64String(byt);
                    }
                    //currentUser.EmailToken = token;
                    string url = GenerateURL(token, RESET_PASSWORD_PATH, null);
                    // Send Mail
                    string SenderEmail = ConfigurationManager.AppSettings.Get("Email");
                    string SenderPassword = ConfigurationManager.AppSettings.Get("Password");
                    string SmtpHost = ConfigurationManager.AppSettings.Get("SmtpHost"); ;
                    int SmtpPort = Convert.ToInt16(ConfigurationManager.AppSettings.Get("SmtpPort"));
                    bool SmtpEnableSSL = Convert.ToBoolean(ConfigurationManager.AppSettings.Get("SmtpEnableSSL"));

                    string Subject = "Reset Enpire Account Password";
                    string line1 = "Please ignore this e-mail if you didn't request to reset your password";
                    string line2 = "Please follow the link beow to reset your account password!";
                    string btnText = "Reset Password";
                    string Body = GenerateEmailFromTemnplate(user.UserName, url, line1, line2, btnText);
                    MailConfiguration mailConfiguration = new MailConfiguration(SenderEmail, "Enpire Team", SenderPassword)
                    {
                        Host = SmtpHost,
                        Port = SmtpPort,
                        EnableSsl = SmtpEnableSSL
                    };
                    Email uEmail = new Email(mailConfiguration);
                    uEmail.Send(user.Email, Subject, Body);


                    return Ok("Please check your email , you will find a link for reseting your password");

                }
                else
                {
                    return BadRequest("There is no account with the provided email , please check and try again.");
                }
            }
            catch (Exception e)
            {
                var ex = e;
            }
            return null;
        }

        //Tested and Complete
        /// <summary>
        /// Takes the reset password model with the confirmation token and update the user data accordingly
        /// Mime Type : application/json
        /// </summary>
        /// <param name="model">Reset Pass Model(Email , token , pass , new pass)</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("ResetPassword")]
        public async Task<IHttpActionResult> ForgetPassword(ForgetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            byte[] byt = Convert.FromBase64String(model.Token);
            string token = System.Text.Encoding.UTF8.GetString(byt);

            using (AuthRepo repository = new AuthRepo())
            {
                IdentityResult result = await repository.ResetPassword(token , model.Email , model.NewPassword);
                if (!result.Succeeded)
                {
                    return GetErrorResult(result);
                }
                return Ok();
            }
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }
        #endregion

        #region Linkedin Functions
        [HttpGet]
        [Route("SaveLinkedinUser")]
        public async Task<IHttpActionResult> SaveLinkedinUser(string code, string state/*, string error, string error_description*/)
        {
            if (string.IsNullOrEmpty(code))
            {
                return Ok();
            }

            var httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://www.linkedin.com/")
            };
            var requestUrl = $"oauth/v2/accessToken?grant_type=authorization_code&code={code}&redirect_uri={AppConfig.Get("Linkedin.RedirectUrl")}&client_id={AppConfig.Get("Linkedin.ClientID")}&client_secret={AppConfig.Get("Linkedin.SecretKey")}";
            var response = await httpClient.GetAsync(requestUrl);
            var token = JsonConvert.DeserializeObject<TokenResponse>(await response.Content.ReadAsStringAsync());
            var access_token = token.Access_token;
            UserInfo user = new UserInfo();
            user = await GetUserFromAccessTokenAsync(token.Access_token);

            var CompanyName = user.Positions.Values[0].Company.Name;
            var Position = user.Positions.Values[0].Title;

            var userModel = new RegisterExternalBindingModel
            {
                UserName = user.FormattedName+user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.EmailAddress,
                Country = user.Location.Name,
                Company = CompanyName,
                Position = Position,
            };


            ExternalLoginInfo info = await Authentication.GetExternalLoginInfoAsync();

            return await RegisterExternal(userModel, access_token);
        }

        private async Task<UserInfo> GetUserFromAccessTokenAsync(string token)
        {
            var apiClient = new HttpClient
            {
                BaseAddress = new Uri("https://api.linkedin.com")
            };
            var url = $"/v1/people/~:({LinkedinUserInfoParameters})?oauth2_access_token={token}&format=json";
            var response = await apiClient.GetAsync(url);
            var jsonResponse = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UserInfo>(jsonResponse);
        }
        #endregion

        #region HelperFunction

        public static string GetBaseUrl()
        {
            string url = string.Empty;
            HttpRequest request = HttpContext.Current.Request;

            // Get the schema from the request 
            //if (request.IsSecureConnection)
            //    url = "https://";
            //else
            //    url = "http://";

            url = request.Url.Scheme + "://" + request.Url.Authority +
            request.ApplicationPath.TrimEnd('/') + "/";
            

            return url;
        }

        public string GenerateURL(string token , string Path, int? flag)
        {
            string apiUrl = (flag == 1)? BASE_URL : "";
            string url = apiUrl + Path + "?token=" + token;

            return url;
        }

        private string GenerateEmailFromTemnplate(string userName, string url, string line1 , string line2, string btnText)
        {
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(HostingEnvironment.MapPath("~/Resources/MailTemp.html")))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{UserName}", userName);
            body = body.Replace("{ConfirmEmailUrl}", url);
            body = body.Replace("{line1}", line1);
            body = body.Replace("{line2}", line2);
            body = body.Replace("{btnText}", btnText);


            return body;
        }

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        public class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }
        #endregion
    }



    public static class GlobalSettings
    {
        public static bool local = false;

        public static string GetUrl ()
        {
            string url = (local == true) ? "http://localhost:4200/" : "http://pinch.gaptech.co/";
            return url;
        }

        public static string GetAPI()
        {
            string url = (local == true) ? "http://localhost:59388/" : "http://pinchapi.gaptech.co/";
            return url;
        }
    }
}
