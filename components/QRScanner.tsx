import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Keyboard } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunning = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const elementId = "reader";
    
    // Safety check to ensure element exists
    if (!document.getElementById(elementId)) return;

    const startScanner = async () => {
      // If already initialized or running, don't start again
      if (scannerRef.current && isScannerRunning.current) return;

      try {
        // cleanup previous instance if it exists but isn't running (edge case)
        if (scannerRef.current) {
             try {
                await scannerRef.current.clear();
             } catch (e) {
                // ignore clear error if not running
             }
        }

        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (isMounted.current) {
               onScanSuccess(decodedText);
            }
          },
          (errorMessage) => {
            // ignore frame errors
          }
        );
        isScannerRunning.current = true;
      } catch (err: any) {
        console.error("Scanner start error:", err);
        if (isMounted.current) {
            let msg = "无法启动摄像头。";
            if (err.name === 'NotAllowedError' || err.toString().includes('Permission denied')) {
                msg = "摄像头权限被拒绝。请在浏览器设置中允许访问摄像头，然后刷新页面重试。";
            } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                msg += "请注意：移动端浏览器通常要求使用 HTTPS 协议才能访问摄像头。";
            } else {
                msg += "请检查摄像头权限设置或设备是否支持。";
            }
            setError(msg);
        }
      }
    };

    startScanner();

    return () => {
      isMounted.current = false;
      const scanner = scannerRef.current;
      
      if (scanner) {
        if (isScannerRunning.current) {
            scanner.stop()
                .then(() => {
                    scanner.clear();
                    isScannerRunning.current = false;
                })
                .catch(err => {
                    console.warn("Failed to stop scanner", err);
                });
        } else {
            // If not running, just clear
            try {
                scanner.clear();
            } catch (e) {
                // ignore
            }
        }
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
        onScanSuccess(manualId.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
            <h3 className="font-bold text-lg flex items-center">
                <Camera className="mr-2 text-blue-600" size={20}/> 
                扫码打卡
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-0 bg-black relative flex-1 flex flex-col justify-center overflow-hidden min-h-[300px]">
            {error ? (
                <div className="p-8 text-center text-white">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4"/>
                    <p className="text-lg font-medium mb-2">摄像头访问失败</p>
                    <p className="text-sm text-slate-400 mb-6">{error}</p>
                    <p className="text-xs text-slate-500">
                        您可以直接使用下方的 ID 输入功能。
                    </p>
                </div>
            ) : (
                 <div id="reader" className="w-full h-full bg-black"></div>
            )}
            
            {!error && (
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                    <p className="text-white/80 text-sm bg-black/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                        请将二维码对准取景框
                    </p>
                </div>
            )}
        </div>

        {/* Manual Input Fallback */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
             <div className="flex items-center justify-between mb-2">
                 <p className="text-xs text-slate-500">摄像头无法使用？手动输入 ID</p>
                 <Keyboard size={14} className="text-slate-400"/>
             </div>
             <form onSubmit={handleManualSubmit} className="flex gap-2">
                 <input 
                    type="text"
                    placeholder="输入用户 ID (如 u1)"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                 />
                 <button 
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                 >
                    确认
                 </button>
             </form>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;