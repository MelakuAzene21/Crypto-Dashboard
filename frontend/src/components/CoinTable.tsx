// frontend/src/components/CoinTable.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  BarChart,
} from "@mui/icons-material";
import Pagination from "./Pagination";

interface CoinTableProps {
  coins: any[];
  loading: boolean;
  showPagination?: boolean;
}

export default function CoinTable({ coins, loading, showPagination = false }: CoinTableProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Calculate pagination
  const totalItems = coins.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoins = showPagination ? coins.slice(startIndex, endIndex) : coins;
  
  // Reset to first page when coins change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [coins.length]);

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString()}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const getSparklineColor = (sparkline: number[]) => {
    if (sparkline.length < 2) return theme.palette.success.main;
    const first = sparkline[0];
    const last = sparkline[sparkline.length - 1];
    return last >= first ? theme.palette.success.main : theme.palette.error.main;
  };

  const renderSparkline = (sparkline: number[]) => {
    if (!sparkline || sparkline.length === 0) return null;
    
    const color = getSparklineColor(sparkline);
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min;
    
    return (
      <Box sx={{ display: "flex", alignItems: "end", height: 30, gap: 0.5 }}>
        {sparkline.slice(-7).map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 20 + 5 : 12;
          return (
            <Box
              key={index}
              sx={{
                width: 3,
                height: height,
                bgcolor: color,
                borderRadius: 0.5,
                opacity: 0.8,
              }}
            />
          );
        })}
      </Box>
    );
  };
  if (loading) {
    return (
      <Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={100} height={24} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={80} height={24} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={100} height={24} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={100} height={24} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={100} height={24} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Skeleton width={80} height={24} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Box>
                        <Skeleton width={80} height={20} />
                        <Skeleton width={40} height={16} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} height={20} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* ✅ Pagination placed INSIDE the return */}
        {showPagination && totalPages > 1 && (
          <Box sx={{ mt: 3 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
              itemsPerPageOptions={[10, 25, 50, 100]}
            />
          </Box>
        )}
      </Box>
    );
  }
  

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(30, 41, 59, 0.5)" }}>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  Asset
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  Price
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  24h Change
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  Market Cap
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  Volume (24h)
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  Chart
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCoins.map((coin) => (
              <TableRow
                key={coin.id}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(59, 130, 246, 0.05)",
                  },
                  "&:last-child td": { border: 0 },
                }}
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={coin.image}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" color="white">
                        {coin.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {coin.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600" color="white">
                    {formatPrice(coin.current_price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                    )}
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color={coin.price_change_percentage_24h >= 0 ? "success.main" : "error.main"}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600" color="white">
                    {formatCurrency(coin.market_cap)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600" color="white">
                    {formatCurrency(coin.total_volume)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {renderSparkline(coin.sparkline_in_7d?.price || [])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box sx={{ mt: 3 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            itemsPerPageOptions={[10, 25, 50, 100]}
          />
        </Box>
      )}
    </Box>
  );
}
