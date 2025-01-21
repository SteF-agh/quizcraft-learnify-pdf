import { useState } from "react";
import { Document } from "../types";

export const useDocumentFilter = (documents: Document[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    
    // Note: questions parameter removed as it's not needed here
    // The filtering by questions is handled in the parent component
    return matchesSearch;
  });

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredDocuments
  };
};