using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class HeaderValue
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }

    public class Headers
    {
        [JsonProperty(PropertyName = "_total")]
        public int Total { get; set; }

        [JsonProperty(PropertyName = "values")]
        public List<HeaderValue> Values { get; set; }
    }

    public class ApiStandardProfileRequest
    {
        [JsonProperty(PropertyName = "headers")]
        public Headers Headers { get; set; }

        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }
    }

    public class Company
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "id")]
        public int? Id { get; set; }

        [JsonProperty(PropertyName = "industry")]
        public string Industry { get; set; }

        [JsonProperty(PropertyName = "size")]
        public string Size { get; set; }

        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }
    }

    public class Country
    {
        [JsonProperty(PropertyName = "code")]
        public string Code { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }

    public class Location
    {

        [JsonProperty(PropertyName = "country")]
        public Country Country { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }

    public class StartDate
    {

        [JsonProperty(PropertyName = "month")]
        public int Month { get; set; }

        [JsonProperty(PropertyName = "year")]
        public int Year { get; set; }
    }

    public class Experience
    {
        [JsonProperty(PropertyName = "company")]
        public Company Company { get; set; }

        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }

        [JsonProperty(PropertyName = "isCurrent")]
        public bool IsCurrent { get; set; }

        [JsonProperty(PropertyName = "location")]
        public Location Location { get; set; }

        [JsonProperty(PropertyName = "startDate")]
        public StartDate StartDate { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }
    }

    public class Positions
    {
        [JsonProperty(PropertyName = "_total")]
        public int Total { get; set; }

        [JsonProperty(PropertyName = "values")]
        public List<Experience> Values { get; set; }
    }

    public class SiteStandardProfileRequest
    {
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }
    }

    public class UserInfo
    {
        [JsonProperty(PropertyName = "apiStandardProfileRequest")]
        public ApiStandardProfileRequest ApiStandardProfileRequest { get; set; }

        [JsonProperty(PropertyName = "emailAddress")]
        public string EmailAddress { get; set; }

        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }

        [JsonProperty(PropertyName = "formattedName")]
        public string FormattedName { get; set; }

        [JsonProperty(PropertyName = "headline")]
        public string Headline { get; set; }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "industry")]
        public string Industry { get; set; }

        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }

        [JsonProperty(PropertyName = "location")]
        public Location Location { get; set; }

        [JsonProperty(PropertyName = "maidenName")]
        public string MaidenName { get; set; }

        [JsonProperty(PropertyName = "numConnections")]
        public int NumConnections { get; set; }

        [JsonProperty(PropertyName = "numConnectionsCapped")]
        public bool NumConnectionsCapped { get; set; }

        [JsonProperty(PropertyName = "pictureUrl")]
        public string PictureUrl { get; set; }

        [JsonProperty(PropertyName = "positions")]
        public Positions Positions { get; set; }

        [JsonProperty(PropertyName = "publicProfileUrl")]
        public string PublicProfileUrl { get; set; }

        [JsonProperty(PropertyName = "siteStandardProfileRequest")]
        public SiteStandardProfileRequest SiteStandardProfileRequest { get; set; }

        [JsonProperty(PropertyName = "summary")]
        public string Summary { get; set; }
    }
}  