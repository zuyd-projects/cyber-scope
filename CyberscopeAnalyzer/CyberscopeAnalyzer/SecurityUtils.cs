using System.IO;
using System.Security.Cryptography;

namespace CyberscopeAnalyzer
{
    public static class SecurityUtils
    {

        public static string GetFileHash(string filePath)
        {
            try
            {
                using (SHA256 sha256 = SHA256.Create())
                using (FileStream stream = File.OpenRead(filePath))
                {
                    byte[] hashBytes = sha256.ComputeHash(stream);
                    return System.BitConverter.ToString(hashBytes).Replace("-", string.Empty);
                }
            }
            catch { return "Could not hash"; }
        }
    }
}
