import React from "react";
import { Toaster } from "sonner";
import EditLayout from "./edit-layout";
import Footer from "./Footer";
import Header from "./Header";
import SettingLayout from "./setting-layout";
import TreeviewLayout from "./treeview-layout";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Toaster position="top-right" richColors />
      <SettingLayout />
      <TreeviewLayout />
      {children}
      <EditLayout />
      <Footer />
    </>
  );
}
