"use client";

import { motion, AnimatePresence } from "framer-motion";
import RouteForm from "./RouteForm";
import {
  ChevronLeft,
  ChevronRight,
  Map,
  Settings,
  Info,
  Waves,
  Compass,
  Ship,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    closed: {
      width: "5rem",
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    open: {
      width: "28rem", // Slightly wider
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
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={() => setActiveTab(tab)}
          className={`
            p-3 rounded-xl transition-all duration-300 group
            ${
              activeTab === tab
                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400"
            }
            hover:scale-105 active:scale-95
          `}
        >
          <Icon
            size={24}
            className="group-hover:rotate-6 transition-transform duration-300"
          />
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50">
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
        bg-white dark:bg-gray-900 
        shadow-2xl border-r dark:border-gray-800
        z-30 
        flex 
        overflow-hidden
        rounded-r-3xl
      `}
    >
      {/* Sidebar Navigation */}
      <div className="w-20 border-r dark:border-gray-800 py-6 flex flex-col items-center bg-gray-50 dark:bg-gray-950">
        <div className="mb-6">
          <Ship className="text-emerald-600 dark:text-emerald-400" size={32} />
        </div>

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
          className={`
            mt-auto mb-6 
            bg-emerald-500 hover:bg-emerald-600 
            text-white p-3 rounded-full 
            shadow-xl hover:shadow-emerald-500/50
            transition-all duration-300
            hover:scale-105 active:scale-95
            group
          `}
        >
          {isNavOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {activeTab === "route" && (
            <motion.div
              key="route"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <motion.h1
                  className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Waves className="text-emerald-500" size={40} />
                  Routing
                </motion.h1>
                <Badge variant="secondary" className="dark:bg-gray-800">
                  <Compass size={16} className="mr-2" /> Maritime Edition
                </Badge>
              </div>

              <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
                <RouteForm
                  setSelectedRoute={setSelectedRoute}
                  isNavOpen={isNavOpen}
                  startPort={startPort}
                  endPort={endPort}
                  setIsSelectingLocation={setIsSelectingLocation}
                />
              </Card>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Settings
              </h2>
              <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
                <p className="text-gray-600 dark:text-gray-400">
                  Routing and application settings coming soon...
                </p>
              </Card>
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                About
              </h2>
              <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Optimal Ship Routing helps plan the most efficient maritime
                  routes using advanced algorithms and real-time data.
                </p>
                <div className="flex items-center gap-3">
                  <Ship size={24} className="text-emerald-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    v1.0.0 - Beta Release
                  </span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
