import { WalletConnectionControls } from "@/components/wallet/wallet-connection-controls";
import { WalletStatusChip } from "@/components/wallet/wallet-status-chip";
import { Chip } from "@/components/ui/chip";

type DashboardHeaderProps = {
  username: string;
  checkedInToday: boolean;
  connected: boolean;
};

export function DashboardHeader({
  username,
  checkedInToday,
  connected,
}: DashboardHeaderProps) {
  return (
    <section className="glass-card overflow-hidden rounded-[2rem] p-5 shadow-soft">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-ink/55">
                {connected ? "Welcome back" : "Preview mode"}
              </p>
              <h1 className="display-font text-4xl font-semibold leading-none text-ink">
                {username}
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink/65">
              {connected
                ? checkedInToday
                  ? "Today is locked in. Rewards, invites, and perks are all ready when you are."
                  : "One quick check-in keeps your streak moving and keeps the app feeling alive."
                : "Connect a wallet to turn this preview into your live streak, rewards, and perks home screen."}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white shadow-soft">
            {username.charAt(0)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <WalletStatusChip />
          <Chip className={checkedInToday ? "bg-mint text-ink" : "bg-coral/10 text-coral"}>
            {checkedInToday ? "Checked in today" : "Check-in waiting"}
          </Chip>
          {!connected ? <Chip className="bg-white/70">Preview data</Chip> : null}
        </div>

        <div className="rounded-[1.6rem] bg-white/70 p-3">
          <WalletConnectionControls />
        </div>
      </div>
    </section>
  );
}
