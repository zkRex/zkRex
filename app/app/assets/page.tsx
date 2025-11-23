"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Asset = {
  symbol: string;
  name: string;
  imageUrl?: string;
  price: number;
  accredited: boolean; // whether the asset is accredited/eligible for the user
  status?: string; // optional extra status text
};

const assets: Asset[] = [
  {
    symbol: "ZKT",
    name: "zkTrex Index Fund",
    imageUrl: "https://avatar.vercel.sh/ZKT",
    price: 128.42,
    accredited: true,
    status: "Eligible",
  },
  {
    symbol: "RWA1",
    name: "RWA Credit Note Series 1",
    imageUrl: "https://avatar.vercel.sh/RWA1",
    price: 1000.0,
    accredited: true,
    status: "Eligible",
  },
  {
    symbol: "EQ-C",
    name: "Tokenized Equity Class C",
    imageUrl: "https://avatar.vercel.sh/EQ-C",
    price: 23.91,
    accredited: false,
    status: "Restricted",
  },
  {
    symbol: "FND-A",
    name: "Growth Fund A",
    imageUrl: "https://avatar.vercel.sh/FND-A",
    price: 54.73,
    accredited: true,
    status: "Eligible",
  },
];

export default function TradePage() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Asset | null>(null);

  function onRowActivate(a: Asset) {
    setSelected(a);
    setOpen(true);
  }

  function onKeyActivate(e: React.KeyboardEvent, a: Asset) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowActivate(a);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trade</h1>
          <p className="text-sm text-muted-foreground">
            Browse assets available to you based on your accreditation and jurisdiction.
          </p>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Symbol</TableHead>
              <TableHead className="w-[56px]">Asset</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((a) => (
              <TableRow
                key={a.symbol}
                role="button"
                tabIndex={0}
                className="cursor-pointer focus-visible:outline-2 focus-visible:outline-ring/70 focus-visible:outline-offset-[-2px]"
                onClick={() => onRowActivate(a)}
                onKeyDown={(e) => onKeyActivate(e, a)}
                aria-label={`Open details for ${a.name}`}
             >
                <TableCell className="font-medium">{a.symbol}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={a.imageUrl || `https://avatar.vercel.sh/${a.symbol}`}
                      alt={a.name}
                      className="h-8 w-8 rounded-full border object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-foreground/90">{a.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {a.price.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {a.accredited ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                      Accredited
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {a.status || "Restricted"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? `${selected.symbol} — ${selected.name}` : "Asset"}
            </DialogTitle>
            <DialogDescription>
              {selected?.accredited
                ? "You are accredited for this asset. Continue to view details and place an order."
                : "This asset is currently restricted for your profile/jurisdiction."}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selected.imageUrl || `https://avatar.vercel.sh/${selected.symbol}`}
                  alt={selected.name}
                  className="h-10 w-10 rounded-full border object-cover"
                />
                <div>
                  <div className="font-medium leading-none">{selected.name}</div>
                  <div className="text-muted-foreground text-xs">{selected.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="font-semibold tabular-nums">
                  {selected.price.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            {selected?.accredited ? (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-background shadow hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
