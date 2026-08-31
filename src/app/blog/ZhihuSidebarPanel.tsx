"use client";

import { useState } from "react";
import ZhihuSidebar from "@/components/ZhihuSidebar";
import type { ZhihuContent } from "@/lib/zhihu-feed";

type FilterType = "all" | ZhihuContent["type"];

export default function ZhihuSidebarPanel() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  return <ZhihuSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />;
}
