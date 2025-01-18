"use client";

import { motion } from "framer-motion";
import NextLink from "next/link";
import { GitIcon, VercelIcon } from "@/components/icons";
import { LinkedinIcon } from "lucide-react";

export function SocialLinks() {
  return (
    <motion.div
      className="flex flex-row gap-4 items-center justify-center fixed bottom-6 inset-x-0 z-50 text-sm"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <NextLink
        target="_blank"
        href="https://github.com/Gaurav-Wankhede"
        className="flex flex-row gap-2 items-center border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300"
      >
        <GitIcon className="text-[#171515] dark:text-[#f0f6fc]" />
        Profile
      </NextLink>

      <NextLink
        target="_blank"
        href="https://gaurav-wankhede.vercel.app/"
        className="flex flex-row gap-2 items-center px-3 py-1.5 rounded-md bg-[#000000] hover:bg-[#111111] text-white dark:bg-[#ffffff] dark:text-[#000000] dark:hover:bg-[#f5f5f5] transition-all duration-300"
      >
        <VercelIcon size={14} className="text-white dark:text-black" />
        Portfolio
      </NextLink>

      <NextLink
        target="_blank"
        href="https://www.linkedin.com/in/wankhede-gaurav/"
        className="flex flex-row gap-2 items-center px-3 py-1.5 rounded-md bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-300"
      >
        <LinkedinIcon size={14} className="text-white" />
        LinkedIn
      </NextLink>
    </motion.div>
  );
}
