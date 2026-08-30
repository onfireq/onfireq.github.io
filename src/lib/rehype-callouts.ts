import type { Nodes, Root, Text } from "hast";

const CALLOUT_PATTERN = /^\[!(tip|info|warning|danger|note)\][\t ]*(?:\r?\n)?/i;

function findFirstText(node: Nodes): Text | undefined {
  if (node.type === "text") return node.value.trim() ? node : undefined;
  if (!("children" in node)) return undefined;

  for (const child of node.children) {
    const text = findFirstText(child);
    if (text) return text;
  }

  return undefined;
}

function visit(node: Nodes): void {
  if (node.type === "element" && node.tagName === "blockquote") {
    const firstText = findFirstText(node);
    const match = firstText?.value.match(CALLOUT_PATTERN);

    if (firstText && match) {
      node.properties.calloutType = match[1].toLowerCase();
      firstText.value = firstText.value.replace(CALLOUT_PATTERN, "");
    }
  }

  if ("children" in node) {
    node.children.forEach(visit);
  }
}

export default function rehypeCallouts() {
  return (tree: Root) => visit(tree);
}
