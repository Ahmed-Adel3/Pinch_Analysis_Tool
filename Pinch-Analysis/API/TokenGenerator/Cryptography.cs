using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace API.TokenGenerator
{
    public class Cryptography
    {
        #region " Private/Internal properties "
        /// <summary>
        /// Input key GUID for encryption ("PLEASE", Keep this inputkey very safe).
        /// </summary>
        internal const string Inputkey = "eaa43680-5571-40cb-ab1a-3bf68f04459e";
        #endregion

        #region " Public Functions "
        /// <summary>
        /// Generate random key for any purpose.
        /// </summary>
        /// <param name="length">The length of the key (64, 128, ...).</param>
        /// <returns>The generated key as a string.</returns>
        public static string GetRandomKey(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int)(num % (uint)valid.Length)]);
                }
            }

            return res.ToString();
        }

        /// <summary>
        /// Encrypt the given text and give the byte array back as a BASE64 string.
        /// </summary>
        /// <param name="text">The text to be encrypted.</param>
        /// <param name="salt">The pasword salt.</param>
        /// <returns>The encrypted text.</returns>
        public static string Encrypt(string text, string salt)
        {
            if (string.IsNullOrEmpty(text))
                throw new ArgumentNullException("text");

            var aesAlg = NewRijndaelManaged(salt);

            var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
            var msEncrypt = new MemoryStream();
            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
            using (var swEncrypt = new StreamWriter(csEncrypt))
            {
                swEncrypt.Write(text);
            }

            return Convert.ToBase64String(msEncrypt.ToArray());
        }

        /// <summary>
        /// Decrypts the given text.
        /// </summary>
        /// <param name="cipherText">The encrypted BASE64 text.</param>
        /// <param name="salt">The pasword salt.</param>
        /// <returns>The decrypted text.</returns>
        public static string Decrypt(string cipherText, string salt)
        {
            if (string.IsNullOrEmpty(cipherText))
                throw new ArgumentNullException("cipherText");

            if (!IsBase64String(cipherText))
                throw new Exception("The cipherText input parameter is not base64 encoded");

            string text;

            var aesAlg = NewRijndaelManaged(salt);
            var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
            var cipher = Convert.FromBase64String(cipherText);

            using (var msDecrypt = new MemoryStream(cipher))
            {
                using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (var srDecrypt = new StreamReader(csDecrypt))
                    {
                        text = srDecrypt.ReadToEnd();
                    }
                }
            }
            return text;
        }
        #endregion

        #region " Private Functions "
        /// <summary>
        /// Checks if a string is base64 encoded.
        /// </summary>
        /// <param name="base64String">The base64 encoded string.</param>
        /// <returns>True if the given string is base64 encoded.</returns>
        private static bool IsBase64String(string base64String)
        {
            base64String = base64String.Trim();
            return (base64String.Length % 4 == 0) &&
                   Regex.IsMatch(base64String, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None);

        }

        /// <summary>
        /// Create a new RijndaelManaged class and initialize it.
        /// </summary>
        /// <param name="salt">The pasword salt.</param>
        /// <returns>The created RijndaelManaged object.</returns>
        private static RijndaelManaged NewRijndaelManaged(string salt)
        {
            if (salt == null) throw new ArgumentNullException("salt");
            var saltBytes = Encoding.ASCII.GetBytes(salt);
            var key = new Rfc2898DeriveBytes(Inputkey, saltBytes);

            var aesAlg = new RijndaelManaged();
            aesAlg.Key = key.GetBytes(aesAlg.KeySize / 8);
            aesAlg.IV = key.GetBytes(aesAlg.BlockSize / 8);

            return aesAlg;
        }
        #endregion
    }
}