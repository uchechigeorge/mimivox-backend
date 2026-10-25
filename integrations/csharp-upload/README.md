# C# upload handler

Drop-in replacement for Cloudinary. Host `Upload.ashx` on any IIS / ASP.NET (.NET Framework 4.x) site.

## Setup

1. Copy `Upload.ashx` to your site root.
2. Add to `Web.config`:

```xml
<configuration>
  <appSettings>
    <add key="UploadApiKey" value="CHANGE_ME_LONG_RANDOM_STRING" />
    <add key="UploadRoot" value="~/uploads" />
    <!-- optional: override the public URL prefix (e.g. a CDN) -->
    <!-- <add key="PublicBaseUrl" value="https://cdn.example.com/uploads" /> -->
  </appSettings>
  <system.web>
    <!-- 100 MB, in KB -->
    <httpRuntime maxRequestLength="102400" executionTimeout="300" />
  </system.web>
  <system.webServer>
    <security>
      <requestFiltering>
        <!-- 100 MB, in bytes -->
        <requestLimits maxAllowedContentLength="104857600" />
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
```

3. Make sure the app pool identity can write to the `uploads` folder, and that the folder serves static files
   but never executes scripts.

## Backend env

```env
UPLOAD_PROVIDER="custom"          # or "cloudinary"
CUSTOM_UPLOAD_URL="https://your-host.com/Upload.ashx"
CUSTOM_UPLOAD_KEY="CHANGE_ME_LONG_RANDOM_STRING"
```

When `UPLOAD_PROVIDER=cloudinary` (the default) the `CLOUDINARY_*` vars are required instead.

## Contract

`POST` multipart/form-data with header `X-Api-Key`, fields `file` and `folder`.
Response: `{ "url", "secure_url", "public_id", "bytes", "format" }`.
