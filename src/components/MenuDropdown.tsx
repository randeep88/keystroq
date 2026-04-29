import { Avatar, Dropdown, Label } from "@heroui/react";
import { Home, Link, LogOut, Swords, Trophy, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const MenuDropdown = ({ user }: { user: any }) => {
  const router = useRouter();
  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar size="sm">
          <Avatar.Image alt={user.name} src={user?.photo} />
          <Avatar.Fallback delayMs={600}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image alt={user.name} src={user?.photo} />
              <Avatar.Fallback delayMs={600}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{user?.name}</p>
              <p className="text-xs leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => router.push("/profile")}
            id="profile"
            textValue="Profile"
          >
            <div className="flex w-full items-center gap-2">
              <User className="size-3.5 text-muted" />
              <Label>Profile</Label>
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => router.push("/")}
            id="home"
            textValue="Home"
          >
            <div className="flex w-full items-center gap-2">
              <Home className="size-3.5 text-muted" />
              <Label>Home</Label>
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => router.push("/leaderboard")}
            id="leaderboard"
            textValue="Leaderboard"
          >
            <div className="flex w-full items-center gap-2">
              <Trophy className="size-3.5 text-muted" />
              <Label>Leaderboard</Label>
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
            id="logout"
            textValue="Logout"
            variant="danger"
          >
            <div className="flex w-full items-center gap-2">
              <LogOut className="size-3.5 text-danger" />
              <Label>Log Out</Label>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default MenuDropdown;
