#!/usr/bin/env python3
"""
Cache & Locality Performance Lab — Plot Results
Usage:
    python3 scripts/plot_results.py --experiment all
    python3 scripts/plot_results.py --experiment stride
    python3 scripts/plot_results.py --experiment workingset
    python3 scripts/plot_results.py --experiment matrix
    python3 scripts/plot_results.py --experiment linkedlist
    python3 scripts/plot_results.py --experiment bandwidth
"""

import argparse
import os
import sys
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

# ── Cache size annotations (edit to match src/config.h) ──────────────────────
L1_KB  = 32
L2_KB  = 256
L3_MB  = 6
L1_B   = L1_KB * 1024
L2_B   = L2_KB * 1024
L3_B   = L3_MB * 1024 * 1024

RESULTS_DIR = "results"
FIG_DIR     = os.path.join(RESULTS_DIR, "figures")
os.makedirs(FIG_DIR, exist_ok=True)

STYLE = {
    "figure.figsize": (9, 5),
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.alpha": 0.35,
    "font.size": 11,
}
plt.rcParams.update(STYLE)


def annotate_cache_levels(ax, xvals, x_is_bytes=True, orientation="vertical"):
    """Draw vertical lines at L1/L2/L3 boundaries on a size-sweep plot."""
    scale = 1 if x_is_bytes else 1
    lim   = ax.get_xlim()
    for size, label, color in [
        (L1_B, f"L1 ({L1_KB} KB)", "#e74c3c"),
        (L2_B, f"L2 ({L2_KB} KB)", "#e67e22"),
        (L3_B, f"L3 ({L3_MB} MB)", "#8e44ad"),
    ]:
        x = size * scale
        if lim[0] <= x <= lim[1]:
            ax.axvline(x, color=color, linestyle="--", linewidth=1.4, alpha=0.8)
            ax.text(x * 1.04, ax.get_ylim()[1] * 0.95, label,
                    color=color, fontsize=9, rotation=90, va="top")


# ─────────────────────────────────────────────────────────────────────────────
def plot_stride():
    path = os.path.join(RESULTS_DIR, "stride.csv")
    if not os.path.exists(path):
        print(f"  [skip] {path} not found — run ./cache_lab stride first")
        return
    df = pd.read_csv(path)

    fig, ax = plt.subplots()
    ax.plot(df["stride_bytes"], df["ns_per_access"],
            marker="o", linewidth=2, color="#2980b9", label="ns/access")
    ax.axvline(64, color="#e74c3c", linestyle="--", linewidth=1.4,
               label="Cache line = 64 B")
    ax.set_xscale("log", base=2)
    ax.set_xlabel("Stride (bytes, log₂ scale)")
    ax.set_ylabel("Time per access (ns)")
    ax.set_title("Exp 1 — Stride Access vs Latency\n(64 MB array, int elements)")
    ax.legend()
    out = os.path.join(FIG_DIR, "stride.png")
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved {out}")


def plot_workingset():
    path = os.path.join(RESULTS_DIR, "workingset.csv")
    if not os.path.exists(path):
        print(f"  [skip] {path} not found — run ./cache_lab workingset first")
        return
    df = pd.read_csv(path)

    fig, ax = plt.subplots()
    ax.plot(df["array_bytes"], df["ns_per_access"],
            marker="o", linewidth=2, color="#27ae60", label="ns/access")
    ax.set_xscale("log", base=2)
    ax.set_xlabel("Array size (bytes, log₂ scale)")
    ax.set_ylabel("Time per access (ns)")
    ax.set_title("Exp 2 — Working Set Size vs Access Latency\n(Sequential scan, int elements)")

    # X-axis labels in human units
    ax.xaxis.set_major_formatter(
        ticker.FuncFormatter(lambda x, _: f"{int(x)//1024} KB" if x < 1e6
                             else f"{int(x)//(1024*1024)} MB"))
    annotate_cache_levels(ax, df["array_bytes"].values)
    ax.legend()
    out = os.path.join(FIG_DIR, "workingset.png")
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved {out}")


def plot_matrix():
    path = os.path.join(RESULTS_DIR, "matrix.csv")
    if not os.path.exists(path):
        print(f"  [skip] {path} not found — run ./cache_lab matrix first")
        return
    df = pd.read_csv(path)

    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    # Left: absolute times
    ax = axes[0]
    ax.plot(df["N"], df["rowmajor_ns"], marker="o", linewidth=2,
            color="#27ae60", label="Row-major")
    ax.plot(df["N"], df["colmajor_ns"], marker="s", linewidth=2,
            color="#e74c3c", label="Col-major")
    ax.set_xlabel("Matrix size N (NxN doubles)")
    ax.set_ylabel("Time per access (ns)")
    ax.set_title("Exp 3 — Matrix Traversal: Latency")
    ax.legend()

    # Right: slowdown ratio
    ax2 = axes[1]
    ax2.bar(df["N"].astype(str), df["slowdown_ratio"], color="#8e44ad", alpha=0.8)
    ax2.axhline(1.0, color="black", linewidth=1, linestyle="--")
    ax2.set_xlabel("Matrix size N")
    ax2.set_ylabel("Col-major / Row-major slowdown")
    ax2.set_title("Exp 3 — Slowdown Ratio (col / row)")

    out = os.path.join(FIG_DIR, "matrix.png")
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved {out}")


def plot_linkedlist():
    path = os.path.join(RESULTS_DIR, "linkedlist.csv")
    if not os.path.exists(path):
        print(f"  [skip] {path} not found — run ./cache_lab linkedlist first")
        return
    df = pd.read_csv(path)

    fig, ax = plt.subplots()
    ax.plot(df["list_bytes"], df["ns_per_hop"],
            marker="o", linewidth=2, color="#c0392b", label="ns/hop (random)")
    ax.set_xscale("log", base=2)
    ax.set_xlabel("List size (bytes, log₂ scale)")
    ax.set_ylabel("Time per hop (ns)")
    ax.set_title("Exp 4 — Pointer Chasing Latency\n(Shuffled linked list, 64-byte nodes)")
    ax.xaxis.set_major_formatter(
        ticker.FuncFormatter(lambda x, _: f"{int(x)//1024} KB" if x < 1e6
                             else f"{int(x)//(1024*1024)} MB"))
    annotate_cache_levels(ax, df["list_bytes"].values)
    ax.legend()
    out = os.path.join(FIG_DIR, "linkedlist.png")
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved {out}")


def plot_bandwidth():
    path = os.path.join(RESULTS_DIR, "bandwidth.csv")
    if not os.path.exists(path):
        print(f"  [skip] {path} not found — run ./cache_lab bandwidth first")
        return
    df = pd.read_csv(path)

    fig, ax = plt.subplots()
    ax.plot(df["array_bytes"], df["copy_gb_per_s"],
            marker="o", linewidth=2, color="#2980b9", label="Copy (read+write)")
    ax.plot(df["array_bytes"], df["sum_gb_per_s"],
            marker="s", linewidth=2, color="#e67e22", label="Sum (read only)")
    ax.set_xscale("log", base=2)
    ax.set_xlabel("Array size (bytes, log₂ scale)")
    ax.set_ylabel("Bandwidth (GB/s)")
    ax.set_title("Exp 5 — Memory Bandwidth by Level\n(double elements)")
    ax.xaxis.set_major_formatter(
        ticker.FuncFormatter(lambda x, _: f"{int(x)//1024} KB" if x < 1e6
                             else f"{int(x)//(1024*1024)} MB"))
    annotate_cache_levels(ax, df["array_bytes"].values)
    ax.legend()
    out = os.path.join(FIG_DIR, "bandwidth.png")
    fig.tight_layout()
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved {out}")


EXPERIMENTS = {
    "stride":     plot_stride,
    "workingset": plot_workingset,
    "matrix":     plot_matrix,
    "linkedlist": plot_linkedlist,
    "bandwidth":  plot_bandwidth,
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Plot cache lab results")
    parser.add_argument("--experiment", default="all",
                        choices=list(EXPERIMENTS.keys()) + ["all"],
                        help="Which experiment to plot (default: all)")
    args = parser.parse_args()

    print(f"\nPlotting experiments: {args.experiment}")
    print(f"Reading CSVs from:   {os.path.abspath(RESULTS_DIR)}/")
    print(f"Saving figures to:   {os.path.abspath(FIG_DIR)}/\n")

    if args.experiment == "all":
        for name, fn in EXPERIMENTS.items():
            print(f"  → {name}")
            fn()
    else:
        EXPERIMENTS[args.experiment]()

    print("\nDone. Open results/figures/ to view the PNG plots.")
