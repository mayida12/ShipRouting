"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";
import RouteForm from "./RouteForm";
import { ChevronLeft, ChevronRight, Map, Settings, Info } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  setSelectedRoute: (route: [number, number][]) => void;
  startPort: [number, number] | null;
  endPort: [number, number] | null;
  setIsSelectingLocation: (type: "start" | "end" | null) => void;
}

export default function Sidebar({
  isNavOpen,
  setIsNavOpen,
  setSelectedRoute,
  startPort,
  endPort,
  setIsSelectingLocation,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"route" | "settings" | "info">(
    "route"
  );

  const sidebarVariants = {
    closed: { width: "5rem" },
    open: {
      width: "24rem",
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  const NavIcon = ({
    icon: Icon,
    label,
    tab,
  }: {
    icon: any;
    label: string;
    tab: "route" | "settings" | "info";
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setActiveTab(tab)}
          className={`p-3 rounded-lg transition-all duration-300 ${
            activeTab === tab
              ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          <Icon size={20} />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <motion.aside
      initial={false}
      animate={isNavOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`
        fixed left-0 top-0 bottom-0 
        bg-white dark:bg-gray-800 
        shadow-lg z-20 
        flex 
        overflow-hidden
      `}
    >
      {/* Sidebar Navigation */}
      <div className="w-20 border-r dark:border-gray-700 py-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <NavIcon icon={Map} label="Route Planning" tab="route" />
          <NavIcon icon={Settings} label="Settings" tab="settings" />
          <NavIcon icon={Info} label="Information" tab="info" />
        </motion.div>

        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="mt-auto mb-6 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-md transition-colors"
        >
          {isNavOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "route" && (
            <motion.div
              key="route"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.h1
                className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Optimal Ship Routing
              </motion.h1>

              <RouteForm
                setSelectedRoute={setSelectedRoute}
                isNavOpen={isNavOpen}
                startPort={startPort}
                endPort={endPort}
                setIsSelectingLocation={setIsSelectingLocation}
              />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h2 className="text-2xl font-semibold mb-4">Settings</h2>
              <p>Routing and application settings coming soon...</p>
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p>
                Optimal Ship Routing helps plan the most efficient maritime
                routes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
