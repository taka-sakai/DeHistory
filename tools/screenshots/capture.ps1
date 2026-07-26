# Chromeウィンドウを物理ピクセル単位で配置し、ストア掲載用のサイズで切り出す。
# Chrome側のスクリーンショット機能ではブラウザのUI（タブ・アドレスバー・ポップアップ）が
# 写らないため、OSの画面キャプチャを使う。
param(
    [Parameter(Mandatory = $true)][int]$ProcessId,
    [string]$OutPath,
    [int]$Width = 1280,
    [int]$Height = 800,
    [switch]$PositionOnly,
    [switch]$NoActivate
)

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win {
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc lpEnumFunc, IntPtr lParam);
    public delegate bool EnumProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr after, int x, int y, int cx, int cy, uint flags);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT r);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, IntPtr extra);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hWnd, int attr, out RECT r, int size);
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
'@

# これを呼ばないと、ディスプレイのスケーリングで縮小された論理座標しか取得できず、
# 1280x800 を切り出せない
[void][Win]::SetProcessDPIAware()
Add-Type -AssemblyName System.Drawing

$pids = @($ProcessId)
Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue |
    ForEach-Object { $pids += $_.ProcessId }

$script:found = @()
$cb = [Win+EnumProc]{
    param($h, $l)
    $wpid = 0
    [void][Win]::GetWindowThreadProcessId($h, [ref]$wpid)
    if (($pids -contains $wpid) -and [Win]::IsWindowVisible($h)) {
        $len = [Win]::GetWindowTextLength($h)
        if ($len -gt 0) {
            $sb = New-Object System.Text.StringBuilder ($len + 1)
            [void][Win]::GetWindowText($h, $sb, $sb.Capacity)
            $script:found += [pscustomobject]@{ H = $h; Title = $sb.ToString() }
        }
    }
    return $true
}
[void][Win]::EnumWindows($cb, [IntPtr]::Zero)
if ($script:found.Count -eq 0) { Write-Output "NO_WINDOW"; exit 1 }
$hwnd = $script:found[0].H

function Get-Bounds([IntPtr]$h) {
    $wr = New-Object Win+RECT; [void][Win]::GetWindowRect($h, [ref]$wr)
    $er = New-Object Win+RECT
    # DWMWA_EXTENDED_FRAME_BOUNDS = 9。GetWindowRect は不可視のリサイズ枠を含むため、
    # そのまま切り出すと背後のデスクトップが写り込む
    if ([Win]::DwmGetWindowAttribute($h, 9, [ref]$er, 16) -ne 0) { $er = $wr }
    return @{ W = $wr; E = $er }
}

if (-not $NoActivate) {
    [void][Win]::ShowWindow($hwnd, 9)
    # フォアグラウンドを持たないプロセスからの SetForegroundWindow は Windows に拒否される。
    # ALTを叩くとそのロックが外れる（2つ目以降のブラウザを起動したときに効いてくる）
    for ($i = 0; $i -lt 3 -and [Win]::GetForegroundWindow() -ne $hwnd; $i++) {
        [Win]::keybd_event(0x12, 0, 0, [IntPtr]::Zero)
        [Win]::keybd_event(0x12, 0, 2, [IntPtr]::Zero)
        [void][Win]::SetForegroundWindow($hwnd)
        Start-Sleep -Milliseconds 200
    }
    Start-Sleep -Milliseconds 250

    # 「見えている枠」がちょうど Width x Height になるよう、不可視枠のぶんだけ大きく指定する
    $b = Get-Bounds $hwnd
    $bw = ($b.W.Right - $b.W.Left) - ($b.E.Right - $b.E.Left)
    $bh = ($b.W.Bottom - $b.W.Top) - ($b.E.Bottom - $b.E.Top)
    $dx = $b.E.Left - $b.W.Left
    $dy = $b.E.Top - $b.W.Top
    [void][Win]::SetWindowPos($hwnd, [IntPtr]::Zero, (0 - $dx), (0 - $dy), ($Width + $bw), ($Height + $bh), 0x0040)
    Start-Sleep -Milliseconds 800
}

$e = (Get-Bounds $hwnd).E
$vw = $e.Right - $e.Left
$vh = $e.Bottom - $e.Top

if ($PositionOnly) {
    Write-Output "POSITIONED visible=${vw}x${vh} at $($e.Left),$($e.Top)"
    exit 0
}

$bmp = New-Object System.Drawing.Bitmap $Width, $Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($e.Left, $e.Top, 0, 0, (New-Object System.Drawing.Size $Width, $Height))
$g.Dispose()
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "OK visible=${vw}x${vh} at $($e.Left),$($e.Top) -> $OutPath"
