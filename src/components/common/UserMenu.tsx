import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, LogOut, Shield, FileCheck } from 'lucide-react';
import { getCurrentUser, setCurrentUser, logout, type User as UserType } from '@/utils/user';
import { useI18n } from '@/contexts/I18nContext';

export default function UserMenu() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(getCurrentUser());
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) return;
    
    const newUser = setCurrentUser(username.trim(), isAdmin);
    setUser(newUser);
    setOpen(false);
    setUsername('');
    setIsAdmin(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {user.isAdmin && <Shield className="w-4 h-4 text-primary" />}
            <User className="w-4 h-4" />
            <span className="hidden md:inline">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm">
            <p className="font-medium">{user.name}</p>
            {user.isAdmin && (
              <p className="text-xs text-muted-foreground">{t.user.loginAsAdmin}</p>
            )}
          </div>
          <DropdownMenuSeparator />
          {user.isAdmin && (
            <>
              <DropdownMenuItem onClick={() => navigate('/admin/review')}>
                <FileCheck className="w-4 h-4 mr-2" />
                内容审核
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t.user.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline">{t.user.login}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.user.login}</DialogTitle>
          <DialogDescription>{t.user.loginPrompt}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t.user.username}</Label>
            <Input
              id="username"
              placeholder={t.user.enterUsername}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="admin" className="text-sm cursor-pointer">
              {t.user.loginAsAdmin}
            </Label>
          </div>
          <Button onClick={handleLogin} className="w-full" disabled={!username.trim()}>
            {t.user.login}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
