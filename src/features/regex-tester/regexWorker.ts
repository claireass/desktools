import { testRegex } from "@/features/regex-tester/logic";

self.onmessage = (
  event: MessageEvent<{ pattern: string; flags: string; sample: string }>,
) => {
  const data = event.data;
  self.postMessage(testRegex(data.pattern, data.flags, data.sample));
};
