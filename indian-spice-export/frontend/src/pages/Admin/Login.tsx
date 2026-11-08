import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("admin@indianspiceexport.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1811] text-[#f7faf8] p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0d2b1d] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#dfb15b]/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-md bg-[#112318] border border-[#233d2c] rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#dfb15b] text-[#0d2b1d] font-serif font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            IS
          </div>
          <h1 className="text-xl font-serif font-bold tracking-wide text-white">Indian Spice Export</h1>
          <p className="text-xs text-[#8cb49b] tracking-wider uppercase mt-1 font-medium">
            Authorized Personnel Control Room
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#c4ded0] mb-1.5">Business Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#739982] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trade@indianspiceexport.com"
                className="w-full bg-[#172d1f] border border-[#274431] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-[#6a8d77] focus:outline-none focus:border-[#dfb15b] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c4ded0] mb-1.5">Access Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#739982] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#172d1f] border border-[#274431] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-[#6a8d77] focus:outline-none focus:border-[#dfb15b] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-[#dfb15b] text-[#0d2b1d] font-semibold text-xs rounded-lg hover:bg-[#ebd28b] transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
          >
            <span>{isLoading ? "Authenticating..." : "Sign into Control Room"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Helper */}
        <div className="mt-8 pt-6 border-t border-[#1c3625]">
          <div className="text-[11px] text-[#789d87] text-center mb-3">Quick demo sign-in accounts:</div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@indianspiceexport.com");
                setPassword("admin123");
              }}
              className="p-2 rounded bg-[#162a1d] hover:bg-[#1c3525] border border-[#264431] text-[#c9e0d3] text-left transition-colors"
            >
              <div className="font-semibold text-white">Owner Account</div>
              <div className="text-[#84a993]">admin@indianspiceexport.com</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("rajesh.trade@indianspiceexport.com");
                setPassword("sales123");
              }}
              className="p-2 rounded bg-[#162a1d] hover:bg-[#1c3525] border border-[#264431] text-[#c9e0d3] text-left transition-colors"
            >
              <div className="font-semibold text-white">Sales Desk</div>
              <div className="text-[#84a993]">rajesh.trade@...</div>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center space-x-1.5 text-[10px] text-[#638771]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Strict Access Control &bull; Supabase RLS Protected</span>
        </div>
      </div>
    </div>
  );
};

export { AdminLoginPage as AdminLogin };
export default AdminLoginPage;
