<script lang="ts">
import { onMount } from "svelte";
// Props: pass the lightweight posts list used on Archive page
export let sortedPosts: Array<
	{ data: { published: Date | string } } | { published?: Date | string }
> = [];

type DayCell = {
	date: Date;
	key: string; // YYYY-MM-DD
	count: number;
};

// Normalize to local date-only (avoid timezone shifting)
const toLocalDateOnly = (d: Date) => {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const formatYMD = (d: Date) => {
	const y = d.getFullYear();
	const m = (d.getMonth() + 1).toString().padStart(2, "0");
	const day = d.getDate().toString().padStart(2, "0");
	return `${y}-${m}-${day}`;
};

// Use native Sunday-first index: Sunday=0 ... Saturday=6
const sundayIndex = (d: Date) => d.getDay();

// Build a count map for posts per day
const countMap: Map<string, number> = new Map();
let earliestPostDate: Date | null = null;

for (const p of sortedPosts) {
	// Handle both shapes: { data: { published } } and direct { published }
	const raw = (p as any)?.data?.published ?? (p as any)?.published;
	if (!raw) continue;
	const d = toLocalDateOnly(new Date(raw));
	const k = formatYMD(d);
	countMap.set(k, (countMap.get(k) || 0) + 1);
	if (!earliestPostDate || d < earliestPostDate) {
		earliestPostDate = d;
	}
}

const today = toLocalDateOnly(new Date());

// Choose a reasonable start: show the last 365 days, aligned to Sunday.
// Align to Sunday so week rows are ordered Sun, Mon ... Sat.
let start = new Date(today);
start.setDate(start.getDate() - 364);
// Align start date to the previous Sunday
const offsetToSunday = sundayIndex(start); // 0 if already Sunday
if (offsetToSunday > 0) start.setDate(start.getDate() - offsetToSunday);

// Build continuous days from start to today
const days: DayCell[] = [];
for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
	const dd = new Date(d);
	const k = formatYMD(dd);
	days.push({ date: dd, key: k, count: countMap.get(k) || 0 });
}

// Group into weeks (columns), each week has 7 days (Sun..Sat)
const weeks: DayCell[][] = [];
for (let i = 0; i < days.length; i += 7) {
	weeks.push(days.slice(i, i + 7));
}

// Responsive: decide months to show based on viewport width
let viewportWidth = 1024;
onMount(() => {
	viewportWidth = window.innerWidth;
	const handler = () => {
		viewportWidth = window.innerWidth;
	};
	window.addEventListener("resize", handler);
	return () => window.removeEventListener("resize", handler);
});
$: monthsToShow = viewportWidth <= 375 ? 3 : viewportWidth <= 768 ? 6 : 12;

// Compute month labels: show label above the first column where month changes
const MONTH_ABBR = [
	"Jan.",
	"Feb.",
	"Mar.",
	"Apr.",
	"May.",
	"Jun.",
	"Jul.",
	"Aug.",
	"Sep.",
	"Oct.",
	"Nov.",
	"Dec.",
];

// Build anchors for the 1st day of each month within the range [start, today]
let firstOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
if (firstOfMonth < start) {
	firstOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1);
}

const monthAnchors: Date[] = [];
for (
	let d = new Date(firstOfMonth);
	d <= today;
	d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
) {
	monthAnchors.push(new Date(d));
}
// Limit to 12 labels at most (drop the earliest if more than 12)
const limitedAnchors =
	monthAnchors.length > 12
		? monthAnchors.slice(monthAnchors.length - 12)
		: monthAnchors;

// Prepare an array mapped to week columns; place label at the column containing the 1st of month
const monthLabelsForWeeks: string[] = Array(weeks.length).fill("");
for (const anchor of limitedAnchors) {
	const daysDiff = Math.floor(
		(toLocalDateOnly(anchor).getTime() - toLocalDateOnly(start).getTime()) /
			(24 * 60 * 60 * 1000),
	);
	const weekIdx = Math.floor(daysDiff / 7);
	if (weekIdx >= 0 && weekIdx < monthLabelsForWeeks.length) {
		const abbr = MONTH_ABBR[anchor.getMonth()];
		monthLabelsForWeeks[weekIdx] = abbr;
	}
}

// Compute the starting week index for the displayed range based on monthsToShow
let displayStartWeekIdx = 0;
$: {
	const earliestDisplayMonth = new Date(
		today.getFullYear(),
		today.getMonth() - (monthsToShow - 1),
		1,
	);
	const diffDisplayDays = Math.floor(
		(toLocalDateOnly(earliestDisplayMonth).getTime() -
			toLocalDateOnly(start).getTime()) /
			(24 * 60 * 60 * 1000),
	);
	const idx = Math.floor(diffDisplayDays / 7);
	displayStartWeekIdx = Math.max(0, Math.min(idx, weeks.length - 1));
}

// Slice weeks and month labels to the displayed range
let weeksDisplay: DayCell[][] = [];
let monthLabelsDisplay: string[] = [];
$: weeksDisplay = weeks.slice(displayStartWeekIdx);
$: monthLabelsDisplay = monthLabelsForWeeks.slice(displayStartWeekIdx);

// Intensity levels based on count (0,1,2,3,4+)
const levelFor = (count: number) => {
	if (count === 0) return 0; // level-0
	if (count === 1) return 1; // level-1
	if (count === 2) return 2; // level-2
	if (count === 3) return 3; // level-3
	return 4; // level-4 for 4 or more
};

const weekdayLabels = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]; // Sunday-first
</script>

<div class="heatmap card-base mb-4 p-4 rounded-[var(--radius-large)]">
  <div class="flex items-center justify-between mb-2">
    <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-2 mb-2
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:left-[-16px] before:top-[5.5px]">热力图</div>
  </div>

  <div class="grid grid-cols-heatmap gap-x-1">
    <!-- Month labels row aligned to week columns (labels at month 1st column) -->
    <div class="month-row" style={`grid-template-columns: repeat(${weeksDisplay.length}, var(--cell-size)); column-gap: var(--gap); margin-left: calc(var(--weekday-width) + var(--week-gap));`}>
      {#each monthLabelsDisplay as label}
        <div class="month-label">{label}</div>
      {/each}
    </div>

    <div class="heatmap-body">
      <!-- Weekday labels -->
      <div class="weekday-col">
        {#each weekdayLabels as wl}
          <div class="weekday">{wl}</div>
        {/each}
      </div>

      <!-- Weeks columns -->
      <div class="weeks">
        {#each weeksDisplay as week}
          <div class="week-col">
            {#each week as cell}
              <div
                class={`cell level-${levelFor(cell.count)}`}
                title={`${cell.key}：${cell.count} 篇`}
              ></div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .heatmap {
    --cell-size: 12px;
    --cell-radius: 3px;
    --gap: 3px;
    --week-gap: 8px;
    --weekday-width: 30px;
    --level-0: color-mix(in oklab, var(--primary) 8%, transparent);
    --level-1: color-mix(in oklab, var(--primary) 22%, transparent);
    --level-2: color-mix(in oklab, var(--primary) 40%, transparent);
    --level-3: color-mix(in oklab, var(--primary) 58%, transparent);
    --level-4: color-mix(in oklab, var(--primary) 78%, transparent);
    --text-muted: rgba(0,0,0,0.75);
  }
  
  /* Dark mode: override muted text color for month and weekday labels (global selectors) */
  :global(.dark) .heatmap {
    --text-muted: rgba(255,255,255,0.75);
  }
  :global(html.dark) .heatmap {
    --text-muted: rgba(255,255,255,0.75);
  }

  /* legend removed */

  .grid.grid-cols-heatmap {
    display: grid;
    grid-template-rows: auto 1fr;
    row-gap: 6px;
    width: max-content;
    margin: 0 auto;
  }

  /* iPad Mini and below (<=768px): enable horizontal scroll and tighten sizes */
  @media (max-width: 768px) {
    .grid.grid-cols-heatmap {
      width: max-content;
      margin: 0 auto;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-gutter: stable both-edges;
    }
    .heatmap {
      --cell-size: 10px;
      --gap: 2px;
      --week-gap: 6px;
      --weekday-width: 26px;
    }
    .month-label { font-size: 11px; }
    .weekday { font-size: 11px; }
    /* Show only Sun., Tue., Thu., Sat. (hide Mon., Wed., Fri.) while keeping spacing */
    .weekday-col .weekday:nth-child(2),
    .weekday-col .weekday:nth-child(4),
    .weekday-col .weekday:nth-child(6) {
      visibility: hidden;
    }
  }

  /* iPhone SE and below (<=375px): further tighten sizes */
  @media (max-width: 375px) {
    .grid.grid-cols-heatmap {
      width: max-content;
      margin: 0 auto;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-gutter: stable both-edges;
    }
    .heatmap {
      --cell-size: 8px;
      --gap: 2px;
      --week-gap: 4px;
      --weekday-width: 24px;
    }
    .month-label { font-size: 10px; }
    .weekday { font-size: 10px; }
    /* Show only Sun., Tue., Thu., Sat. (hide Mon., Wed., Fri.) while keeping spacing */
    .weekday-col .weekday:nth-child(2),
    .weekday-col .weekday:nth-child(4),
    .weekday-col .weekday:nth-child(6) {
      visibility: hidden;
    }
  }

  .month-row {
    display: grid;
  }
  .month-label {
    font-size: 12px;
    color: var(--text-muted) !important;
    /* Center the label's visual midpoint over the column center */
    justify-self: center;
    width: max-content;
  }

  .heatmap-body {
    display: grid;
    grid-template-columns: var(--weekday-width) 1fr;
    column-gap: var(--week-gap);
  }

  .weekday-col {
    display: grid;
    row-gap: var(--gap);
    width: var(--weekday-width);
  }
  .weekday {
    height: var(--cell-size);
    line-height: var(--cell-size);
    font-size: 12px;
    color: var(--text-muted) !important;
    text-align: right;
  }

  .weeks {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content;
    column-gap: var(--gap);
  }
  .week-col {
    display: grid;
    grid-template-rows: repeat(7, var(--cell-size));
    row-gap: var(--gap);
  }
  .cell {
    width: var(--cell-size);
    height: var(--cell-size);
    border-radius: var(--cell-radius);
    background: var(--level-0);
  }
  .cell.level-1 { background: var(--level-1); }
  .cell.level-2 { background: var(--level-2); }
  .cell.level-3 { background: var(--level-3); }
  .cell.level-4 { background: var(--level-4); }
</style>