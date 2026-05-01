import type { SVGProps } from "react";

/**
 * Decorative botanical mark — abstracted laurel/foxglove silhouette.
 * Soft, drawn-feel curves. Ornament, not art.
 */
export function Botanical(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1">
        {/* central stem */}
        <path d="M300 540 C 300 420, 296 320, 300 60" />

        {/* paired leaves cascading up the stem */}
        <path d="M300 480 C 250 470, 210 442, 200 410 C 240 412, 282 432, 300 478" fill="currentColor" fillOpacity="0.18" />
        <path d="M300 480 C 350 470, 390 442, 400 410 C 360 412, 318 432, 300 478" fill="currentColor" fillOpacity="0.18" />

        <path d="M300 410 C 252 402, 218 376, 210 346 C 246 350, 284 366, 300 408" fill="currentColor" fillOpacity="0.22" />
        <path d="M300 410 C 348 402, 382 376, 390 346 C 354 350, 316 366, 300 408" fill="currentColor" fillOpacity="0.22" />

        <path d="M300 340 C 256 332, 226 308, 220 282 C 252 286, 286 300, 300 338" fill="currentColor" fillOpacity="0.26" />
        <path d="M300 340 C 344 332, 374 308, 380 282 C 348 286, 314 300, 300 338" fill="currentColor" fillOpacity="0.26" />

        <path d="M300 270 C 262 264, 236 244, 232 220 C 260 224, 290 236, 300 268" fill="currentColor" fillOpacity="0.30" />
        <path d="M300 270 C 338 264, 364 244, 368 220 C 340 224, 310 236, 300 268" fill="currentColor" fillOpacity="0.30" />

        <path d="M300 200 C 268 196, 248 180, 244 160 C 268 164, 290 174, 300 198" fill="currentColor" fillOpacity="0.34" />
        <path d="M300 200 C 332 196, 352 180, 356 160 C 332 164, 310 174, 300 198" fill="currentColor" fillOpacity="0.34" />

        {/* small bell flowers at the top */}
        <g fill="currentColor" fillOpacity="0.42">
          <ellipse cx="300" cy="120" rx="10" ry="14" />
          <ellipse cx="282" cy="92" rx="8" ry="12" />
          <ellipse cx="318" cy="92" rx="8" ry="12" />
          <ellipse cx="300" cy="68" rx="6" ry="10" />
        </g>

        {/* base flourish */}
        <path d="M260 540 C 280 528, 320 528, 340 540" />
      </g>
    </svg>
  );
}
