param(
    [string]$AppDir = ".\desktop-release\win-unpacked",
    [string]$ShortcutPath = ".\desktop-release\DiscordLyrics.lnk",
    [string]$AppUserModelId = "local.discordlyrics.desktop"
)

$resolvedAppDir = Resolve-Path -LiteralPath $AppDir
$targetPath = Join-Path $resolvedAppDir "DiscordLyrics.exe"
$iconPath = Join-Path $resolvedAppDir "resources\assets\icon.ico"
$shortcutDir = Split-Path -Parent $ShortcutPath
$shortcutName = Split-Path -Leaf $ShortcutPath

if (-not (Test-Path -LiteralPath $targetPath)) {
    throw "Missing executable: $targetPath"
}

if (-not (Test-Path -LiteralPath $iconPath)) {
    throw "Missing icon: $iconPath"
}

if (-not (Test-Path -LiteralPath $shortcutDir)) {
    New-Item -ItemType Directory -Force -Path $shortcutDir | Out-Null
}

$resolvedShortcutDir = Resolve-Path -LiteralPath $shortcutDir
$shortcutFullPath = Join-Path $resolvedShortcutDir $shortcutName

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutFullPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $resolvedAppDir.Path
$shortcut.IconLocation = "$iconPath,0"
$shortcut.Description = "DiscordLyrics"
$shortcut.Save()

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

[ComImport]
[Guid("00021401-0000-0000-C000-000000000046")]
public class CShellLink { }

[ComImport]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
[Guid("0000010b-0000-0000-C000-000000000046")]
public interface IPersistFile {
    void GetClassID(out Guid pClassID);
    void IsDirty();
    void Load([MarshalAs(UnmanagedType.LPWStr)] string pszFileName, uint dwMode);
    void Save([MarshalAs(UnmanagedType.LPWStr)] string pszFileName, bool fRemember);
    void SaveCompleted([MarshalAs(UnmanagedType.LPWStr)] string pszFileName);
    void GetCurFile([MarshalAs(UnmanagedType.LPWStr)] out string ppszFileName);
}

[ComImport]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
[Guid("00000138-0000-0000-C000-000000000046")]
public interface IPropertyStore {
    void GetCount(out uint cProps);
    void GetAt(uint iProp, out PROPERTYKEY pkey);
    void GetValue(ref PROPERTYKEY key, out PROPVARIANT pv);
    void SetValue(ref PROPERTYKEY key, ref PROPVARIANT pv);
    void Commit();
}

[StructLayout(LayoutKind.Sequential, Pack = 4)]
public struct PROPERTYKEY {
    public Guid fmtid;
    public uint pid;
}

[StructLayout(LayoutKind.Sequential)]
public struct PROPVARIANT {
    public ushort vt;
    public ushort wReserved1;
    public ushort wReserved2;
    public ushort wReserved3;
    public IntPtr p;
    public int p2;

    public static PROPVARIANT FromString(string value) {
        PROPVARIANT pv = new PROPVARIANT();
        pv.vt = 31;
        pv.p = Marshal.StringToCoTaskMemUni(value);
        return pv;
    }
}

public static class ShortcutAppId {
    [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
    private static extern void SHGetPropertyStoreFromParsingName(
        [MarshalAs(UnmanagedType.LPWStr)] string pszPath,
        IntPtr pbc,
        uint flags,
        ref Guid riid,
        out IPropertyStore propertyStore
    );

    public static void SetAppUserModelId(string shortcutPath, string appId) {
        var propertyStoreId = new Guid("00000138-0000-0000-C000-000000000046");
        IPropertyStore propertyStore;
        SHGetPropertyStoreFromParsingName(shortcutPath, IntPtr.Zero, 2, ref propertyStoreId, out propertyStore);

        var appIdKey = new PROPERTYKEY {
            fmtid = new Guid("9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3"),
            pid = 5
        };
        var appIdValue = PROPVARIANT.FromString(appId);
        propertyStore.SetValue(ref appIdKey, ref appIdValue);
        propertyStore.Commit();
    }
}
"@

try {
    [ShortcutAppId]::SetAppUserModelId($shortcutFullPath, $AppUserModelId)
} catch {
    Write-Warning "Could not write AppUserModelID to shortcut. The app executable still sets AppUserModelID at runtime."
}

Write-Output "Created shortcut: $shortcutFullPath"
Write-Output "AppUserModelID: $AppUserModelId"
