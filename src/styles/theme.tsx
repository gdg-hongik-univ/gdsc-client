const BREAKPOINT = 993;

export const media = {
  pc: `@media (min-width: ${BREAKPOINT}px)`,
  mobile: `@media (max-width : ${BREAKPOINT - 1}px)`
};
