export type ShareContent = {
  title: string;
  text: string;
  url: string;
  kind: "campaign" | "product" | "article";
  id: string;
};

export type ShareResult = "shared" | "copied" | "cancelled" | "manual";

export type ShareBrowser = {
  share?: (data: { title: string; text: string; url: string }) => Promise<void>;
  copy?: (text: string) => Promise<void>;
};
