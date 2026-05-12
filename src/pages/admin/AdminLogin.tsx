import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAdminPassword } from '@/lib/supabase';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setIsAuthenticated = useAppStore(state => state.setIsAuthenticated);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supaPassword = await getAdminPassword();
      const storedPassword = supaPassword || localStorage.getItem('adminPassword') || 'Thinkers123';
      
      if (password === storedPassword) {
        // Also keep local storage in sync
        localStorage.setItem('adminPassword', storedPassword);
        setIsAuthenticated(true);
      } else {
        setError('Invalid password.');
      }
    } catch (err: any) {
       setError('Login error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary font-serif font-bold text-2xl">
            A
          </div>
          <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
          <CardDescription>Enter your credential to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full h-12" disabled={isLoading}>{isLoading ? 'Loading...' : 'Login'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
