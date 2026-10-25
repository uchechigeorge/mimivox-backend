<%@ WebHandler Language="C#" Class="Upload" %>

using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// POST multipart/form-data: file (required), folder (optional)
/// Header: X-Api-Key
/// Returns: { "url", "secure_url", "public_id", "bytes", "format" }
/// </summary>
public class Upload : IHttpHandler
{
    private static readonly HashSet<string> AllowedExtensions = new HashSet<string>(
        StringComparer.OrdinalIgnoreCase)
    {
        ".mp3", ".wav", ".ogg", ".mp4", ".webm", ".png", ".jpg", ".jpeg", ".webp", ".gif"
    };

    public bool IsReusable { get { return true; } }

    public void ProcessRequest(HttpContext context)
    {
        if (context.Request.HttpMethod != "POST")
        {
            WriteJson(context, 405, new { error = "Method not allowed" });
            return;
        }

        string expectedKey = ConfigurationManager.AppSettings["UploadApiKey"];
        string providedKey = context.Request.Headers["X-Api-Key"];
        if (string.IsNullOrEmpty(expectedKey) || !ConstantTimeEquals(expectedKey, providedKey))
        {
            WriteJson(context, 401, new { error = "Invalid API key" });
            return;
        }

        if (context.Request.Files.Count == 0 || context.Request.Files[0].ContentLength == 0)
        {
            WriteJson(context, 400, new { error = "No file uploaded" });
            return;
        }

        HttpPostedFile file = context.Request.Files[0];
        string ext = Path.GetExtension(file.FileName ?? "");
        if (!AllowedExtensions.Contains(ext))
        {
            WriteJson(context, 400, new { error = "File type not allowed" });
            return;
        }
        ext = ext.ToLowerInvariant();

        // Only letters, digits, '-', '_' and '/' survive; blocks "..", drive letters, etc.
        string folder = (context.Request.Form["folder"] ?? "").Trim();
        folder = Regex.Replace(folder.Replace('\\', '/'), "[^a-zA-Z0-9_/\\-]", "");
        folder = Regex.Replace(folder, "/{2,}", "/").Trim('/');

        string uploadRoot = ConfigurationManager.AppSettings["UploadRoot"] ?? "~/uploads";
        string rootPath = Path.GetFullPath(context.Server.MapPath(uploadRoot));
        string targetDir = Path.GetFullPath(Path.Combine(rootPath, folder.Replace('/', Path.DirectorySeparatorChar)));
        if (!targetDir.StartsWith(rootPath, StringComparison.OrdinalIgnoreCase))
        {
            WriteJson(context, 400, new { error = "Invalid folder" });
            return;
        }
        Directory.CreateDirectory(targetDir);

        string name = Guid.NewGuid().ToString("N");
        file.SaveAs(Path.Combine(targetDir, name + ext));

        string relative = (folder.Length > 0 ? folder + "/" : "") + name + ext;
        string baseUrl = ConfigurationManager.AppSettings["PublicBaseUrl"];
        if (string.IsNullOrEmpty(baseUrl))
        {
            baseUrl = context.Request.Url.GetLeftPart(UriPartial.Authority)
                + VirtualPathUtility.ToAbsolute(uploadRoot);
        }
        string url = baseUrl.TrimEnd('/') + "/" + relative;

        WriteJson(context, 200, new
        {
            url = url,
            secure_url = url,
            public_id = (folder.Length > 0 ? folder + "/" : "") + name,
            bytes = file.ContentLength,
            format = ext.TrimStart('.')
        });
    }

    private static bool ConstantTimeEquals(string a, string b)
    {
        if (a == null || b == null || a.Length != b.Length) return false;
        int diff = 0;
        for (int i = 0; i < a.Length; i++) diff |= a[i] ^ b[i];
        return diff == 0;
    }

    private static void WriteJson(HttpContext context, int status, object payload)
    {
        context.Response.TrySkipIisCustomErrors = true;
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        context.Response.Write(new JavaScriptSerializer().Serialize(payload));
    }
}
