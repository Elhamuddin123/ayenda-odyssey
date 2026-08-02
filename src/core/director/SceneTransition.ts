import type { TransitionStyle } from "./directorTypes";

export function describeTransition(t: TransitionStyle) {
  switch (t) {
    case "Fade":
      return "gentle fade";
    case "SlowExposure":
      return "slow exposure";
    case "LightBloom":
      return "subtle bloom";
    case "Silence":
      return "silence";
    case "CrossDissolve":
      return "cross dissolve";
    default:
      return "fade";
  }
}
